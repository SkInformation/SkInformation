import apiRequest, {HttpMethod} from "@/app/lib/api";

interface Data {
    example: string;
}

interface ReportProps {
    params: {
        id: number
    }
}

export default async function Report({params}: ReportProps) {
    const result = await apiRequest<Data>(HttpMethod.GET, `report/${params.id}`, {}, {}, {}, (err) => {
        console.error(err.message)
    });

    // Render your component using the data state
    // ...

    return (
        <>{JSON.stringify(result, null, 2)}</>
    );
}