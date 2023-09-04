import { Time, convertToDisplayTime } from "../../../utils/convertToDisplayTime";
import { format } from 'date-fns'

interface ReserveHeaderProps {
  image: string;
  name: string;
  date: string;
  partySize: string;
}

export default function ReserveHeader({ image, name, date, partySize }: ReserveHeaderProps) {
  const peopleAmount =
    parseInt(partySize, 10) === 1 ? `${partySize} person` : `${partySize} people`;

  const time = date.split('T')[1]

  const formattedDay = format(new Date(date), "ccc, LLL, d")

  return (
    <div>
      <h3 className="font-bold">You're almost done!</h3>
      <div className="mt-5 flex">
        <img src={image} alt="Restaurant Image" className="w-32 h-18 rounded" />
        <div className="ml-4">
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="flex mt-3">
            <p className="mr-6">{formattedDay}</p>
            <p className="mr-6">{convertToDisplayTime(time as Time)}</p>
            <p className="mr-6">{peopleAmount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
