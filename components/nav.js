import React from 'react';
import Link from 'next/link';
import fetch from 'node-fetch'
const links = [{href:"/articles/breaking-news", name:"Breaking News"}, {href:"/articles/politique", name:"Politique"}, {href:"/articles/economie", name:"Économie"}, {href:"/articles/technologie", name:"Technologie"}, {href:"/articles/ecologie", name:"Écologie"}, {href:"/articles/all", name:"Tous les articles"}]

class Nav extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true
    };
    this.user = {
      avatar: null,
      username: null
    }
  };

  async UNSAFE_componentWillMount() {
    console.log("OK");
    const response = await fetch("http://localhost:3000/api/discord/get/basics");
    const json = await response.json();
    console.log("nav:",json);
    this.user = {
      avatar: `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.png`,
      username: json.username
    }
  }

  _toggleLinks() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {

    return(
      <header className="">
        <div className="bg-red-500 max-w-full">
        {
        //Logo and Search
        } 
        <div className="flex items-center justify-between px-4 py-3 lg:mt-6">
          <div className="flex justify-between">
            <div className="lg:ml-8">
              <img className="lg:hidden h-10" src="/profile.png" alt="Blue Project"/>
              <img className="hidden lg:block h-10" src="/logo.png" alt="Blue Project"/>
            </div>
            <div className="ml-3 lg:ml-32 relative">
              <input className="font-ubuntu w-full transition focus:outline-0 focus:outline-none border border-transparent bg-white border-gray-200 focus:border-gray-300 placeholder-gray-600 rounded-lg py-2 pr-0 pl-10 block" type="text" placeholder="Rechercher"/>
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-800">
                <svg className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                </svg>
              </div>
            </div>
          </div>
          {
          //Buger and account
          }
          
          <div className="flex">
            <div className="lg:hidden">
              <button type="button" className="text-gray-500 focus:outline-none" onClick={() => this._toggleLinks()}>
                <svg className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  {
                    this.state.isOpen ? 
                      <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/>
                    :
                      <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                  }
                </svg>
              </button>
            </div>
            <div>
              <a href={"/api/discord/login"}>Login</a>
            </div>
            <div>
              <a href={"/api/discord/get/basics"}>test</a>
            </div>
          </div>
        </div>
        </div>
        {
        //Catégories d'articles
        }
        <div className={`ml:3 mt:5 px-2 pr-3 py-5 ${this.state.isOpen ? 'block' : 'hidden'} lg:inline-block lg:ml-8 lg:mt-16 lg:py-0 `}>
          <div className="mt-2 px-3 text-2xl font-raleway font-semibold underline lg:font-extrabold lg:text-3xl lg:no-underline">Explorer</div>
          <div className="mt-6 lg:mt-12">
            {
              links.map(l => (
                <Link  href={l.href} key={l.name}>
                  <a className="mt-1 ml-6 block pl-3 pr-5 py-2 font-ubuntu font-light rounded hover:bg-gray-200 lg:w-auto lg:font-normal lg:ml-4 lg:mt-3">{l.name}</a>
                </Link>
              ))
            }
          </div>

        </div>
      </header>
    );
  }
}

export default Nav;
