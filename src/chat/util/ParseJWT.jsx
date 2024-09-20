//解析jwt中的payload,返回对象
function decodeJwt() {
    const token = localStorage.getItem("ACCESS_TOKEN")
    // 分割JWT字符串
    const parts = token.split('.');
    if (parts.length !== 3) {
        return false
    }

    // 解码Payload
    const payloadBase64Url = parts[1];
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = atob(payloadBase64.padEnd(payloadBase64.length + (4 - payloadBase64.length % 4) % 4, '='));

    // 将解码后的字符串转换为JSON对象
    return JSON.parse(payloadJson);
}

export default decodeJwt