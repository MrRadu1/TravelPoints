import Navbar from "./navbar";
import { ReactComponent as ShieldSvg } from "../../externals/Shield.svg";
import { ReactComponent as PlaneSvg } from "../../externals/Vectorplane.svg";
import { ReactComponent as FadersSvg } from "../../externals/Faders.svg";

export const Hero = () => {
  return (
    <div className="screen4-frame14">
      <div className="screen4-frame40">
        <div className="screen4-frame39">
          <Navbar textColor={"white"}/>
          <div className="screen4-hero-content">
            <span className="screen4-text11">
              <span>Explore the world with exciting people</span>
            </span>
            <span className="screen4-text13">
              <span>
                We help people find co travellers and also structure their
                travel plans
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="screen4-features">
        <div className="screen4-feature">
          <ShieldSvg className="screen4-shield-checksvg" />
          <span className="screen4-text-feature-bold">
            <span>Enjoy some flexibility</span>
          </span>
          <span className="screen4-text-feature-thin">
            <span>
              stays with flexible cancelation make it easy to re-book if your
              plans change
            </span>
          </span>
        </div>
        <div className="screen4-feature">
          <PlaneSvg className="screen4-airplanesvg" />
          <span className="screen4-text-feature-bold">
            <span>Over 2 million active trips</span>
          </span>
          <span className="screen4-text-feature-thin">
            <span>
              stays with flexible cancelation make it easy to re-book if your
              plans change
            </span>
          </span>
        </div>
        <div className="screen4-feature">
          <FadersSvg className="screen4-faderssvg" />
          <span className="screen4-text-feature-bold">
            <span>Over 2 million active trips</span>
          </span>
          <span className="screen4-text-feature-thin">
            <span>
              stays with flexible cancelation make it easy to re-book if your
              plans change
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
