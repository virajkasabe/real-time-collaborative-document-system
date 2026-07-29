const USERONE = 'https://res.cloudinary.com/qnf2f4fq/image/upload/v1785182256/user_1_x3gp49.jpg'
const USERTWO = 'https://res.cloudinary.com/qnf2f4fq/image/upload/v1785182327/user_2_djibzl.jpg'
const USERTHREE = 'https://res.cloudinary.com/qnf2f4fq/image/upload/v1785182354/user_3_pds1us.jpg'
const USERFOUR = 'https://res.cloudinary.com/qnf2f4fq/image/upload/v1785182368/user_4_pzi38p.jpg'
const USERFIVE = 'https://res.cloudinary.com/qnf2f4fq/image/upload/v1785182387/user_5_ujglxb.jpg'
const USERSIX = 'https://res.cloudinary.com/qnf2f4fq/image/upload/v1785182461/user_6_lowol3.jpg'
const USERSEVEN = 'https://res.cloudinary.com/qnf2f4fq/image/upload/v1785182486/user_7_unufd2.jpg'
const USEREITH= 'https://res.cloudinary.com/qnf2f4fq/image/upload/v1785182492/user_8_sklopw.jpg'
const CURRENTUSER = 'https://res.cloudinary.com/qnf2f4fq/image/upload/v1785182615/current_user_wuxwlm.jpg'

const users = [USERONE, USERTWO, USERTHREE, USERFOUR, USERFIVE, USERSIX, USERSEVEN, USEREITH];
const randomUser = users[Math.floor(Math.random() * users.length)];

export {
    randomUser,
    CURRENTUSER
};