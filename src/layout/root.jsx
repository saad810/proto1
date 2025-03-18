import React from "react";

export default function RootLayout({ children }) {
  return <div className="w-screen h-screen overflow-x-hidden">{children}</div>;
}
