export const applyActionToOps = (ops = [], action) => {
  if (action.type === "insert") {
    const shifted = ops.map((op) => ({
      ...op,
      position:
        op.position >= action.position
          ? op.position + action.text.length
          : op.position,
    }));

    shifted.push({
      text: action.text,
      position: action.position,
      attributes: action.attributes || {},
    });

    return shifted.sort((a, b) => a.position - b.position);
  }

  if (action.type === "delete") {
    const deleteLen = action.length || 1;
    const deleteStart = action.position;
    const deleteEnd = deleteStart + deleteLen;

    return ops
      .filter((op) => {
        const opStart = op.position;
        const opEnd = op.position + op.text.length;

        // ✅ Drop any op that overlaps with the deleted range
        const fullyBefore = opEnd <= deleteStart;   // op ends before delete starts
        const fullyAfter  = opStart >= deleteEnd;   // op starts after delete ends

        return fullyBefore || fullyAfter;
      })
      .map((op) => ({
        ...op,
        // ✅ Only shift ops that come AFTER the deleted range
        position:
          op.position >= deleteEnd
            ? op.position - deleteLen
            : op.position,
      }));
  }

  if (action.type === "format") {
    const formatEnd = action.position + (action.length || 1);
    return ops.map((op) =>
      op.position >= action.position && op.position < formatEnd
        ? { ...op, attributes: { ...op.attributes, ...action.attributes } }
        : op
    );
  }

  return ops;
};

/**
 * Apply multiple actions in sequence to the ops array.
 */
export const applyActionsToOps = (ops = [], actions = []) => {
  return actions.reduce((currentOps, action) => {
    return applyActionToOps(currentOps, action);
  }, ops);
};

/**
 * Transform actionB against actionA so both can be applied independently.
 */
export const transformAction = (actionA, actionB) => {
  const b = { ...actionB };

  try {
    if (actionA.type === "insert" && actionB.type === "insert") {
      if (actionA.position <= actionB.position) {
        b.position += actionA.text.length;
      }
    } else if (actionA.type === "insert" && actionB.type === "delete") {
      if (actionA.position <= actionB.position) {
        b.position += actionA.text.length;
      } else if (actionA.position < actionB.position + (actionB.length || 1)) {
        b.length = (b.length || 1) + actionA.text.length;
      }
    } else if (actionA.type === "delete" && actionB.type === "insert") {
      const deleteLen = actionA.length || 1;
      if (actionA.position + deleteLen <= actionB.position) {
        b.position -= deleteLen;
      } else if (actionA.position < actionB.position) {
        b.position = actionA.position;
      }
    } else if (actionA.type === "delete" && actionB.type === "delete") {
      const aLen = actionA.length || 1;
      const bLen = actionB.length || 1;
      const aEnd = actionA.position + aLen;
      const bEnd = actionB.position + bLen;

      if (aEnd <= actionB.position) {
        // A is entirely before B — shift B left
        b.position -= aLen;
      } else if (actionA.position >= bEnd) {
        // A is entirely after B — no change
      } else {
        // Overlapping deletes — shrink B by the overlap
        const overlapStart = Math.max(actionA.position, actionB.position);
        const overlapEnd = Math.min(aEnd, bEnd);
        const overlapLen = overlapEnd - overlapStart;
        b.length = bLen - overlapLen;
        if (actionA.position < actionB.position) {
          b.position -= actionB.position - actionA.position;
        }
      }
    }
  } catch (err) {
    console.error("transformAction error:", err);
  }

  return b;
};

/**
 * Transform all of actionsB against all of actionsA.
 * Call this when the client is behind the server version.
 */
export const transformOperations = (actionsA = [], actionsB = []) => {
  if (!actionsA.length) return actionsB;
  if (!actionsB.length) return [];

  let transformed = [...actionsB];

  for (const actionA of actionsA) {
    transformed = transformed.map((actionB) => transformAction(actionA, actionB));
  }

  // Drop deletes that were made redundant by overlapping concurrent deletes
  return transformed.filter(
    (action) => action.type !== "delete" || (action.length && action.length > 0)
  );
};