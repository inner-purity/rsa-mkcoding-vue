//对后端传来的responseData进行自动化消息格式处理
import { ElNotification } from "element-plus";

function responseDataMessage(responseData,messageData) {
  console.log(responseData);
  const code = responseData.code;
  ElNotification({
    title: `${responseData.msg}`,
    message: `${messageData ? messageData : ""}`,
    type: `${code === 1 ? "success" : "error"}`,
    offset: 50,
    duration: 1500,
  });
}

export default responseDataMessage;
