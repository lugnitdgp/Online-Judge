
import { } from "@material-ui/icons";


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
