import React from "react";
import { SvgCss } from "react-native-svg";
import PropTypes from "prop-types";

import LineIcons from "./icons/line.json";
import MonochromeIcons from "./icons/monochrome.json";

const variantSelector = variant => {
  switch (variant) {
    case 'line':
      return LineIcons;
    case 'monochrome':
      return MonochromeIcons;
    default:
      return {};
  }
}

const UniconsIcon = props => {
  const { variant, name, color, colorPrimary, colorSecondary, colorTertiary, colorQuaternary, colorQuinary, opacityPrimary, opacitySecondary, opacityTertiary, opacityQuaternary, opacityQuinary, size, ...otherProps } = props;
  const svg = variantSelector(variant)[name];
  if (!svg) {
    throw `Icon ${name} (${variant}) not found!`
  }
  const xml = `
  <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
    <style>
    .uim-primary {
      opacity: ${opacityPrimary ? opacityPrimary : 1};
      ${colorPrimary ? `color: ${colorPrimary};` : ''}
    }
    .uim-secondary {
      opacity: ${opacitySecondary ? opacitySecondary : 0.7};
      ${colorSecondary ? `color: ${colorPrimary};` : ''}
    }
    .uim-tertiary {
      opacity: ${opacityTertiary ? opacityTertiary : 0.5};
      ${colorTertiary ? `color: ${colorTertiary};` : ''}
    }
    .uim-quaternary {
      opacity: ${opacityQuaternary ? opacityQuaternary : 0.25};
      ${colorQuaternary ? `color: ${colorQuaternary};` : ''}
    }
    .uim-quinary {
      opacity: ${opacityQuinary ? opacityQuinary : 0};
      ${colorQuinary ? `color: ${colorQuinary};` : ''}
    }
    </style>
    ${svg}
  </svg>
  `;
  return (
    <SvgCss xml={xml} {...otherProps} />
  );
};

UniconsIcon.propTypes = {
  variant: PropTypes.string,
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

UniconsIcon.defaultProps = {
  variant: "line",
  color: "currentColor",
  size: "24"
};

export default UniconsIcon;