// import { makeStyles } from "@material-ui/core/styles";
import {} from "@material-ui/icons";

// const styles = makeStyles(() => ({
//   root: {
//     height: "50vh",
//     width: "60vw",
//   },
// }));

interface IProps {
  children: any;
}

export default (props: IProps) => {
  //   const classes = styles();

  return (
    <pre>
      <output>{props.children}</output>
    </pre>
  );
};
