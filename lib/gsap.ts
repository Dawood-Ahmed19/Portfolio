"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, CustomEase, SplitText);

CustomEase.create("curtain", "0.76, 0, 0.24, 1");
CustomEase.create("count", "0.16, 1, 0.3, 1");
CustomEase.create("outExpoSoft", "0.16, 1, 0.3, 1");

export { gsap, useGSAP, SplitText };
