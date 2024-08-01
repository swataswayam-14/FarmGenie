""
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
export const Footer = () => {
  return (
<div className="bottom-0 w-full p-4 bg-gray-900 dark:bg-slate-900 px-6 lg:px-36 print:hidden">
      <div className="md:max-w-screen-2xl mt-4 mx-auto flex flex-row items-start justify-between w-full">
        <div className="flex flex-col md:flex-row w-3/5 md:justify-between">
          <div className=" ml-21 ">
            <Link href={"https://farmgenie-rho.vercel.app/"} target="_blank" rel="noopener noreferrer">
            </Link>
          </div>
          <div className="flex flex-col justify-center my-8 md:my-0">
            <h3 className="font-semibold text-neutral-100 mb-4">Quick Links</h3>
            <Link
              href={"https://farmgenie-rho.vercel.app/"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 text-neutral-200"
            >
              FarmGenie
            </Link>
            <Link
              href={"https://github.com/swataswayam-14/FarmGenie"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 text-neutral-200"
            >
              GitHub
            </Link>
            <Link href={"/tnc"} className="hover:text-blue-500 text-neutral-200">
              Terms & Conditions
            </Link>
            <Link href={"/privacy-policy"} className="hover:text-blue-500 text-neutral-200">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <Link
            href={"https://farmgenie-rho.vercel.app/"}
            target="_blank"
            className="hover:text-blue-500 font-semibold  text-neutral-200 mb-4"
          >
            Download App
          </Link>
          <div>
            <h4 className="text-neutral-200 font-semibold mb-2">Follow us</h4>
            <div className="flex gap-x-2">
            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/swata-swayam-dash-051307269/">
                <svg className="text-white hover:text-blue-500" aria-hidden="true" viewBox="0 0 24 24">
                </svg>
            </a>

            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/swata-swayam-dash-051307269/">
                <svg className="text-white hover:text-blue-500" aria-hidden="true" viewBox="0 0 24 24">
                </svg>
            </a>

            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/swata-swayam-dash-051307269/">
                <svg className="text-white hover:text-blue-500" aria-hidden="true" viewBox="0 0 24 24">
                </svg>
            </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};