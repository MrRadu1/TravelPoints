import { ReactComponent as RightArrow } from "../../externals/right-arrow.svg";
import { ReactComponent as Instagram } from "../../externals/instagram.svg";
import { ReactComponent as Facebook } from "../../externals/facebook.svg";

export const Footer = () => {
  return (
    <div className="screen4-screen4">
      <div className="screen4-frame28">
        <div className="screen4-frame27">
          <span className="screen4-text73">
            <span>
              <span>Ready to go?</span>
              <br></br>
              <span>Give us a quick call</span>
            </span>
          </span>
          <button className="screen4-button">
            <span className="screen4-text78">
              <span>Contact us</span>
            </span>
            <RightArrow className="screen4-arrowright02roundsvg" />
          </button>
        </div>
      </div>
      <div className="screen4-footer">
        <div className="screen4-header-nav1">
          <div className="screen4-logo1">
            <span className="screen4-text80">
              <span className="screen4-text81">Travel</span>
              <span>Points.</span>
            </span>
          </div>
        </div>
        <img
          src="https://play.teleporthq.io/static/svg/default-img.svg"
          alt="Rectangle192693"
          className="screen4-rectangle19"
        />
        <div className="screen4-frame141">
          <div className="screen4-frame29">
            <Instagram />
            <Facebook />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
