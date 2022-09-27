// 这个函数用来解析数据帧里的文本内容
function parseMessage(buffer) {
  // 第一个字节，包含了FIN位，opcode, 掩码位
  const firstByte = buffer.readUInt8(0);
  // [FIN, RSV, RSV, RSV, OPCODE, OPCODE, OPCODE, OPCODE];
  // 右移7位取首位，
  const isFinalFrame = Boolean((firstByte >>> 7) & 0x01);
  console.log("isFIN: ", isFinalFrame);
  // 取出操作码，低四位
  const opcode = firstByte & 0x0f;
  if (opcode === 0x08) {
    // 连接关闭
    return;
  }
  if (opcode === 0x02) {
    // 二进制帧
    return;
  }
  if (opcode === 0x01) {
    // 目前只处理文本帧
    let offset = 1;
    const secondByte = buffer.readUInt8(offset);
    const useMask = Boolean((secondByte >>> 7) & 0x01);
    console.log("use MASK: ", useMask);
    const payloadLen = secondByte & 0x7f; // 低7位表示载荷字节长度
    offset += 1;
    // 四个字节的掩码
    let MASK = [];
    if (payloadLen <= 0x7d) {
      // 载荷长度小于125
      MASK = buffer.slice(offset, 4 + offset);
      offset += 4;
      console.log("payload length: ", payloadLen);
    } else if (payloadLen === 0x7e) {
      console.log("payload length: ", buffer.readInt16BE(offset));
      // 长度是126， 则后面两个字节作为payload length
      MASK = buffer.slice(offset + 2, offset + 2 + 4);
      offset += 6;
    } else {
      // 长度是127， 则后面8个字节作为payload length
      MASK = buffer.slice(offset + 8, offset + 8 + 4);
      offset += 12;
    }
    // 开始读取后面的payload，与掩码计算，得到原来的字节内容
    const newBuffer = [];
    for (let i = 0, j = 0; i + offset < buffer.length; i += 1, j = i % 4) {
      const nextBuf = buffer[i + offset];
      newBuffer.push(nextBuf ^ MASK[j]);
    }
    return Buffer.from(newBuffer).toString();
  }
  return "";
}

module.exports = {parseMessage}
