// ==UserScript==
// @name Censor
// @match *://*/*
// @author KaninchenSpeed (https://github.com/KaninchenSpeed)
// @license CC-BY-SA
// @version 1.0
// ==/UserScript==

const rnd_id = new Date().getMilliseconds().toString(32); // random id to not break existing classes

const config = {
    censored_words: [ // blocked words (string or regex)
        'page',
        'word2',
        'test'
    ],
    blocked: {
        background_color: '#f00', // hex color [#<r><g><b>] r/g/b = 0..f
        text_color: '#000', // hex color [#<r><g><b>] r/g/b = 0..f
        text: 'Blocked', // displayed block text
        show_on_hover: true, // true = showing blocked word when hovering; false = no hover effect
        overlay: false, // true = shows overlay above word; false = dosent show overlay
        replace: true, // true = replaces word with <replace_char><last character of word>; false = keeps original word
        replace_char: '*' //               inserted here /\
    },
    override_prefixes: [ // ignore
        'href=', //ignore urls of links
        'src=', // ignore source urls of images/videos/o.s.
        'class="', // an attempt of not breaking websites
        `class="blocked_${rnd_id}">` // DO NOT REMOVE (or it will loop)
    ]
};

let running = false;

const run_censor = () => {
  	running = true;
    const new_dom = document.body.innerHTML.split(' ').map((word) => {
        if (!config.override_prefixes.some(pre => word.startsWith(pre))) {
            const censor = config.censored_words.some(filter => {
                const regexp = typeof filter === 'string' ? new RegExp(filter, 'gi') : filter;
                if (regexp.test(word)) {
                    const wordtrimmed = word.match(regexp)[0].trim();
                    word = word.replace(regexp, config.blocked.overlay ? `<span class="blocked_${rnd_id}">${config.blocked.replace ? `${config.blocked.replace_char.repeat((wordtrimmed.length - 1) / Math.floor(config.blocked.replace_char.length))}${wordtrimmed.charAt(wordtrimmed.length - 1)}` : word.match(regexp)[0]}</span>` : config.blocked.replace ? `${config.blocked.replace_char.repeat((wordtrimmed.length - 1) / Math.floor(config.blocked.replace_char.length))}${wordtrimmed.charAt(wordtrimmed.length - 1)}` : word.match(regexp)[0]);
                    return true;
                }
                return false;
            });
            if (censor) {
                console.log(word);
            }
        }
        return word;
    }).join(' ');
    if (new_dom !== document.body.innerHTML) {
        document.body.innerHTML = new_dom;
    }
  	running = false;
};


const style_el = document.createElement('style'); // injected css
style_el.innerHTML = `
    .blocked_${rnd_id} {
        position: relative;
    }

    .blocked_${rnd_id}::after {
        content: '${config.blocked.text}';
        position: absolute;
        inset: 0;
        color: ${config.blocked.text_color};
        background-color: ${config.blocked.background_color};
        overflow: hidden;
    }

    ${config.blocked.show_on_hover ? `
    .blocked_${rnd_id}:hover::after {
        opacity: 0;
    }
    ` : ''}
`;
document.head.append(style_el);

run_censor();
setInterval(() => {
    if (!running) {
      	run_censor();
    }
}, 100);