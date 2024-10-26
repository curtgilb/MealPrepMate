import { InView } from "react-intersection-observer";
import { Card } from "../Card";

interface LoadingCardsProps {
  onView?: () => void;
  vertical: boolean;
}
export function LoadingCards({ onView, vertical }: LoadingCardsProps) {
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
        <Card
          loading={true}
          image={{
            images: [],
            placeholder: "/pot.jpg",
            grid: false,
          }}
          vertical={vertical}
        ></Card>
      </InView>
      <Card
        loading={true}
        image={{
          images: [],
          placeholder: "/pot.jpg",
          grid: false,
        }}
        vertical={vertical}
      ></Card>
      <Card
        loading={true}
        image={{
          images: [],
          placeholder: "/pot.jpg",
          grid: false,
        }}
        vertical={vertical}
      ></Card>
    </>
  );
}
