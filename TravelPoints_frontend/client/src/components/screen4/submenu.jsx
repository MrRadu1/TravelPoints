const Submenuw = ({children, position}) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        overflow: "auto",
        position: "absolute",
        flexDirection: "column",
        alignItems: "center",
        top: "50px",
        left: position,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(148, 170, 177, 0.699999988079071)",
          width: "136px",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "6px",
          padding: "12px 11px",
          flexShrink: "0",
          borderRadius: "20px",
        }}
      >
      {children}
      </div>
    </div>
  );
};

export default Submenuw;
