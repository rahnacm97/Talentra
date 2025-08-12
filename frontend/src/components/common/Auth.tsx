import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import teamImage from '../../assets/team-image.png';
import 'react-toastify/dist/ReactToastify.css';
import ApartmentIcon from '@mui/icons-material/Apartment';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import WorkIcon from '@mui/icons-material/Work';

export default function ScreenLeft () {
  return (
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-10">
        <PersonSearchRoundedIcon sx={{ color: '#3963eef7', fontSize: 40 }}/>
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Over 1,752,324 candidates waiting for good employees.</h1>
        <div className="flex space-x-6 mb-8">
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-full inline-block">
              <ApartmentIcon/>
            </div>
            <p className="text-gray-600 mt-2">
              Companies <br />
              <span className="text-blue-600 font-semibold">25 +</span>
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-full inline-block">
              <GroupAddIcon/>
            </div>
            <p className="text-gray-600 mt-2">
              Candidates <br />
              <span className="text-blue-600 font-semibold">700 +</span>
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-full inline-block">
                <WorkIcon/>
            </div>
            <p className="text-gray-600 mt-2">
              New Jobs <br />
              <span className="text-blue-600 font-semibold">20 +</span>
            </p>
          </div>
        </div>
        <img src={teamImage} alt="Team Collaboration" className="w-3/4 rounded-lg shadow-md" />
      </div>
  );
};
