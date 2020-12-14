import React from "react";

export const FormSuccess = ({text}) => (
  <div className="alert alert-success" role="alert">
    {text}
  </div>
);
export const FormError = ({ text }) => (
  <div className="alert alert-danger" role="alert">
    {text}
  </div>
);
