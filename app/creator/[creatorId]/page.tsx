import Streamview from "@/app/components/StreamView";

type Props = {
  params: {
    creatorId: string;
  };
};

export default function CreatorPage({ params }: Props) {
  return (
    <div>
      <Streamview creatorId={params.creatorId} />
    </div>
  );
}