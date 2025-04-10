import Streamview from "@/app/components/StreamView";

export default function CreatorPage({ params }: any) {
  const { creatorId } = params;

  return <Streamview creatorId={creatorId} />;
}