import { InView } from "react-intersection-observer";
import { Card } from "./Card";

interface LoadingCardsProps {
  onView?: () => void;
  small: boolean;
}
export function LoadingCards({ onView, small }: LoadingCardsProps) {
  return (
    <>
      <InView
        as="div"
        onChange={(inView, entry) => {
          if (inView && onView) {
            onView();
          }
        }}
        triggerOnce={true}
      >
        <Card loading={true} urls={[]} altText="" small={small}></Card>
      </InView>
      <Card loading={true} urls={[]} altText="" small={small}></Card>
      <Card loading={true} urls={[]} altText="" small={small}></Card>
    </>
  );
}
