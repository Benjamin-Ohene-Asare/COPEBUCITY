import React from 'react'
import Header from '../../component/header/Header'
import Hero from '../../component/hero/Hero'
import About from '../../component/about/About'
import OurLeaders from '../../component/OurLeaders/OurLeaders'
import OurMinistries from '../../component/OurMinistries/OurMinistries'
import UpcomingEvents from '../../component/UpcomingEvents/UpcomingEvents'
import Announcements from '../../component/Announcements/Announcements'
const Home = () => {
  return (
    <div>
      <Header/>
      <Hero/>
      <About/>
      <OurLeaders/>
      <OurMinistries/>
      <UpcomingEvents/>
      <Announcements/>
    </div>
  )
}

export default Home
