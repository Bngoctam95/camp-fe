import { Facebook, Instagram, Twitter } from "lucide-react";

const UserFooter = () => {
  return (
    <footer className="bg-forest text-white pt-6 pb-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} FanCamping. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-white hover:text-campfire" aria-label="Facebook">
              <Facebook />
            </a>
            <a href="#" className="text-white hover:text-campfire" aria-label="Twitter">
              <Twitter />
            </a>
            <a href="#" className="text-white hover:text-campfire" aria-label="Instagram">
              <Instagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
