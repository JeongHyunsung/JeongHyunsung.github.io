import MarkdownIt from 'markdown-it';
import mdUnderline from 'markdown-it-underline';
import mdHighlight from 'markdown-it-highlightjs';
import hljs from 'highlight.js'

const mdParser = new MarkdownIt();
// 플러그인 적용
mdParser.use(mdUnderline);
mdParser.use(mdHighlight, {hljs});

export default mdParser;