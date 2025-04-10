import Streamview from "@/app/components/StreamView";

 export default function ({
    params: {
        creatorId
    }
}:{
    params:{
        creatorId: string;
    }
}){
    return <div>
        <Streamview creatorId={creatorId}/>
    </div>
}

