const formatXml = (xml) => {
  let formatted = '';
  let reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, '$1\n$2$3');
  let pad = 0;
  xml.split('\n').forEach((node) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else if (node.match(/^<\w([^>]*[^\/])?>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }
    let padding = '';
    for (let i = 0; i < pad; i++) {
      padding += '  ';
    }
    formatted += padding + node + '\n';
    pad += indent;
  });
  return formatted;
};

const formatJson = (log) => {
  let formatted = '';
  log.split('\n').forEach((line) => {
    try {
      const parsed = JSON.parse(line);
      formatted += JSON.stringify(parsed, null, 2) + '\n';
    } catch {
      formatted += line + '\n';
    }
  });
  return formatted;
};

const fapignore = (log) => {
  const regex = /fapsAndServices=\{[^}]+\}/g;
  return log.replace(regex, '');
}

module.exports = { formatXml, formatJson, fapignore };
