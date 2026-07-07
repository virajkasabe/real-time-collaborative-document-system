import USERONE from './user_1.jpg'
import USERTWO from './user_2.jpg'
import USERTHREE from './user_3.jpg'
import USERFOUR from './user_4.jpg'
import CURRENTUSER from './current_user.jpg'

const users = [USERONE, USERTWO, USERTHREE, USERFOUR];
const randomUser = users[Math.floor(Math.random() * users.length)];

export {
    randomUser,
    CURRENTUSER
};