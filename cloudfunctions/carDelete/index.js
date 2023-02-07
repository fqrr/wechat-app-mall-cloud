// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: "test1-fqr"
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        console.log(1);
        return await db.collection('shopCar').where({
            productChecked: true
        }).remove()
    } catch (e) {
        console.error(e)
    }
}