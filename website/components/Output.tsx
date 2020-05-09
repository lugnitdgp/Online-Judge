// import { makeStyles } from "@material-ui/core/styles";
import {} from "@material-ui/icons";

// const styles = makeStyles(() => ({
//   root: {
//     height: "50vh",
//     width: "60vw",
//   },
// }));

export default ({ children }) => {
//   const classes = styles();

  return (
    <pre>
      <output>{children}</output>
    </pre>
  );
};
