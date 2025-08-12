
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/index';
import { Link } from 'react-router-dom';
import Header from '../../layout/candidate/Header';
import Footer from '../../layout/candidate/Footer';
import EmployerHeader from '../../layout/employer/EmployerHeader';
import EmployerFooter from '../../layout/employer/EmployerFooter';
import heroImage from '../../assets/67c821501ca0d_jobs_header_img.webp';
import testimonialImage from '../../assets/testimony.png';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import ActionAreaCard from '../common/Card';
import SearchAppBar from '../common/Search';

const Homepage: React.FC = () => {
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log('User state in Homepage:', user);
  }, [user]);

  const isCandidate = user?.role === 'candidate';
  const isEmployer = user?.role === 'employer';

  return (
    <div className="bg-gray-100 min-h-screen">
      {isCandidate ? (
        <Header />
      ) : isEmployer ? (
        <EmployerHeader />
      ) : (
        <header className="bg-[#c6e1fc] shadow-md p-4 flex justify-between fixed items-center w-full z-50">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <PersonSearchRoundedIcon sx={{ color: 'black', fontSize: 40 }} />
              <h1 className="text-xl font-bold text-black">Talentra</h1>
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link to="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                {user ? (
                  <>
                    <li>
                      <Link to="/profile" className="hover:underline">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button onClick={() => {}} className="hover:underline">
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="hover:underline">
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link to="/signup" className="hover:underline">
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>
      )}

      <section className="bg-blue-50 py-12 text-center">
        <div className="flex w-full justify-between">
          <div className="w-1/2 h-3 mt-32">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Talentra
            </h1>
            <p className="text-gray-600 mb-6">
              Find your dream job or hire top talent today!
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Get Started
            </button>
          </div>
          <img className="h-[250px] mt-12" src={heroImage} alt="" />
        </div>
        <SearchAppBar />
      </section>

      <section className="py-12 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Job Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ActionAreaCard />
          <ActionAreaCard />
          <ActionAreaCard />
          <ActionAreaCard />
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-6">Featured Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold">Senior Developer</h3>
            <p className="text-gray-600">Company XYZ | $80K - $100K</p>
            <button className="mt-2 bg-blue-600 text-white p-2 rounded">
              Apply Now
            </button>
          </div>
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold">Marketing Manager</h3>
            <p className="text-gray-600">Company ABC | $60K - $80K</p>
            <button className="mt-2 bg-blue-600 text-white p-2 rounded">
              Apply Now
            </button>
          </div>
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold">Senior Developer</h3>
            <p className="text-gray-600">Company XYZ | $80K - $100K</p>
            <button className="mt-2 bg-blue-600 text-white p-2 rounded">
              Apply Now
            </button>
          </div>
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold">Marketing Manager</h3>
            <p className="text-gray-600">Company ABC | $60K - $80K</p>
            <button className="mt-2 bg-blue-600 text-white p-2 rounded">
              Apply Now
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          Trusted Employers
        </h2>
        <div className="bg-white p-4 shadow-md rounded-lg flex items-center">
          <img
            src={testimonialImage}
            alt="Testimonial"
            className="w-24 h-24 object-cover rounded-full mr-4"
          />
          <div>
            <p className="text-gray-600">"Great platform to find talent!"</p>
            <p className="text-blue-600 font-semibold">John Doe, CEO</p>
          </div>
        </div>
      </section>

      {isCandidate ? (
        <Footer />
      ) : isEmployer ? (
        <EmployerFooter />
      ) : (
        <footer className="bg-[#2f3e4d] text-white py-6 text-center">
          <p>&copy; 2025 Workscape. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="text-blue-300 hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-blue-300 hover:underline">
              Terms of Service
            </a>
          </div>
        </footer>
      )}

      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      )}
      {error && (
        <div className="fixed inset-0 bg-red-100 p-4 text-red-800">{error}</div>
      )}
    </div>
  );
};

export default Homepage;
