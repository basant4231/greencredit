import { Open_Sans, Oswald, Outfit, Roboto_Slab, Source_Sans_3 } from "next/font/google";

export const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
});
