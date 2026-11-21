/* Colored code lines for the snippet (mirrors the design exactly) */
const T = (text, cls) => ({ text, cls });
const tag = 'text-codeline-tag';
const name = 'text-codeline-name';
const str = 'text-codeline-link';
const cmt = 'text-menu-text';
const wht = 'text-white';

const desktopLines = [
  [T('const', tag), T(' page ', wht), T('= ', wht), T('findPage', name), T('(', wht), T("'you-were-looking-for'", str), T(');', wht)],
  [],
  [T('if', tag), T(' (!page) {', wht)],
  [T('  console', name), T('.', wht), T('log', name), T('(', wht), T('"Oops! Looks like you took a wrong turn in the codebase."', str), T(');', wht)],
  [T('  console', name), T('.', wht), T('log', name), T('(', wht), T('"But hey, since you\'re here ... "', str), T(');', wht)],
  [T('  console', name), T('.', wht), T('log', name), T('(', wht), T('"🔍 Go back to the homepage and explore more cool stuff!"', str), T(');', wht)],
  [T('  throw', tag), T(' new', tag), T(' Error', name), T('(', wht), T('"404: PageNotFoundError 😢"', str), T(');', wht)],
  [T('}', wht)],
  [],
  [T('/* Suggestions:', cmt)],
  [T(' * - Check the URL for typos', cmt)],
  [T(' * - Use the site navigation', cmt)],
  [T(' * - Or hit CMD+Z in real life 😅', cmt)],
  [T(' */', cmt)],
  [],
  [T('redirect', tag), T('(', wht), T("'home'", str), T(');', wht)],
];

const mobileLines = [
  [T('throw', tag), T(' new', tag), T(' Error', name), T('(', wht)],
  [T('"404: PageNotFoundError 😢"', str)],
  [T(');', wht)],
  [],
  [T('goBack', name), T('()', wht), T(' || ', tag), T('goHome', name), T('();', wht)],
];

const CodeBlock = ({ lines }) => (
  <div className="flex text-[13px] lg:text-base">
    {/* Line numbers */}
    <div className="flex flex-col items-end pr-6 select-none flex-shrink-0">
      {lines.map((_, i) => (
        <span key={i} className="font-[Fira_Code_Retina] text-menu-text opacity-50 leading-7 lg:leading-8">
          {i + 1}
        </span>
      ))}
    </div>
    {/* Code */}
    <div className="flex-1 overflow-x-auto">
      <pre className="font-[Fira_Code_Retina]">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="leading-7 lg:leading-8 whitespace-pre-wrap break-words">
              {line.length === 0 ? ' ' : line.map((part, j) => (
                <span key={j} className={part.cls}>{part.text}</span>
              ))}
            </div>
          ))}
        </code>
      </pre>
    </div>
  </div>
);

const NotFound = () => {
  return (
    <main id="not-found" className="page flex flex-col items-center justify-center overflow-auto custom-scrollbar">
      {/* Ambient gradients (same as the rest of the site) */}
      <div className="css-blurry-gradient-blue"></div>
      <div className="css-blurry-gradient-green"></div>

      <div className="z-20 w-full max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        {/* 404 glyph (exact shape from the design) */}
        <img
          src="/images/404.png"
          alt="404"
          className="w-[240px] lg:w-[320px] h-auto flex-shrink-0 select-none"
          draggable="false"
        />

        {/* Code snippet */}
        <div className="w-full lg:w-auto">
          {/* Desktop full snippet */}
          <div className="hidden lg:block">
            <CodeBlock lines={desktopLines} />
          </div>
          {/* Mobile short snippet */}
          <div className="block lg:hidden">
            <CodeBlock lines={mobileLines} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
