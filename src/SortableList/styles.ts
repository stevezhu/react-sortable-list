import { css } from 'emotion'

export const styles = {
  root: css`
    position: relative;

    .react-draggable {
      /* prevent collapsing margins https://www.w3.org/TR/CSS2/box.html#collapsing-margins */
      overflow: auto;
    }
  `,
}
