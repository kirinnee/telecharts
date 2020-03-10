import {Core, Kore} from "@kirinnee/core";
import {DOMEx, DOMExtend} from "@kirinnee/domex";
import {EaseFactory, kEaseFactory} from "@kirinnee/kease";
import {EleFact, ElementFactory} from "@kirinnee/elefact";
import * as gsap from 'gsap';
import {TweenLite} from 'gsap';
import {AsynchronousAnimator, GSAPAsyncAnimator, GSAPSyncAnimator, SynchronousAnimator} from "@kirinnee/animate";
import {AnimateX, AnimX} from "@kirinnee/animatex";

const text = require('gsap/TextPlugin');
require('gsap/ScrollToPlugin');

let core: Core = new Kore();
core.ExtendPrimitives();

let domex: DOMEx = new DOMExtend(core);
domex.ExtendPrimitives();

let eases: EaseFactory = new kEaseFactory(gsap);
let eleFact: ElementFactory = new EleFact(domex, "k-space");
let animator: SynchronousAnimator = new GSAPSyncAnimator(TweenLite, text, eases, eleFact, domex, core);
let asyncAnimator: AsynchronousAnimator = new GSAPAsyncAnimator(animator);

const blank = eleFact.DIV({}).Style("display", "none");
document.querySelector("body")!.Append(blank);

let animX: AnimateX = new AnimX(asyncAnimator);
animX.ExtendPrimitives();

const $$ = (i: number): Promise<void> => new Promise<void>(r => setTimeout(r, i));

const isMobile = (): boolean => window.innerHeight > window.innerWidth;

function responsiveAdapter() {
	if (isMobile()) {
		document.querySelector("body")!.AddClass("mobile");
		document.querySelector("body")!.RemoveClass("non-mobile");
	} else {
		document.querySelector("body")!.AddClass("non-mobile");
		document.querySelector("body")!.RemoveClass("mobile");
	}
}

function Commarize(x: number): string {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

responsiveAdapter();

window.addEventListener("resize", () => {
	responsiveAdapter();
});

export {
	$$,
	core,
	animX,
	eases,
	eleFact,
	isMobile,
	TweenLite,
	Commarize,
}
