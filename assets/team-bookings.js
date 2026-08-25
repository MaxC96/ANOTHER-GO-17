(function(){
  'use strict';

  var profiles=[
    {
      name:'Danya Cohan',
      role:'Founder & CEO',
      photo:'assets/images/danya-art-optimized.webp',
      booking:'https://bookings.cloud.microsoft/bookwithme/user/bf34a3b24a0745c894b038c8042edc94%40gothamtelecom.com?anonymous&ismsaljsauthenabled'
    },
    {
      name:'Elie Theodore',
      role:'Vice President',
      photo:'assets/images/elie-art-optimized.webp',
      booking:'https://bookings.cloud.microsoft/bookwithme/user/6024e26f7215492296622584fb568c2c%40gothamtelecom.com?anonymous&ismsaljsauthenabled'
    },
    {
      name:'Renso Reyes',
      role:'Customer Success',
      photo:'assets/images/renso-art-optimized.webp',
      booking:'https://bookings.cloud.microsoft/bookwithme/user/3a07f4f281ec43ce84c78b91c66e2f5e%40gothamtelecom.com/meetingtype/MOUtQafnsESZ6zq9LLfjug2?anonymous&ismsaljsauthenabled'
    },
    {
      name:'Faith Robinson',
      role:'Operations Manager',
      photo:'assets/images/faith-art-optimized.webp',
      booking:'https://bookings.cloud.microsoft/bookwithme/user/44b1ece85e7741ec95b08ac8ca7264cb%40gothamtelecom.com/meetingtype/iqXhc-CAN06SXWIHV4ekwg2?anonymous&ismsaljsauthenabled'
    },
    {
      name:'Roberto Valle',
      role:'Mobility Analyst & Customer Success',
      photo:'assets/images/roberto-art-optimized.webp',
      booking:'https://bookings.cloud.microsoft/bookwithme/user/d3350cf96f2349ed994207e9fca8e8c9%40gothamtelecom.com?anonymous&ismsaljsauthenabled'
    }
  ];

  var byName={};
  profiles.forEach(function(profile){byName[profile.name]=profile;});
  window.GOTHAM_TEAM_BOOKINGS=profiles.slice();

  function addStyles(){
    if(document.getElementById('gotham-team-bookings-styles'))return;
    var style=document.createElement('style');
    style.id='gotham-team-bookings-styles';
    style.textContent='\
.team-card-actions{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:14px;flex-wrap:wrap}\
.team-card-actions>.linkedin-link{margin:0}\
.team-card-booking-link,.team-qa-booking-link,.consultation-booking-button{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 16px;border:0;border-radius:10px;background:#2563eb;color:#fff;text-decoration:none;font-size:.88rem;font-weight:800;line-height:1;transition:transform .2s ease,background .2s ease,box-shadow .2s ease}\
.team-card-booking-link:hover,.team-card-booking-link:focus-visible,.team-qa-booking-link:hover,.team-qa-booking-link:focus-visible,.consultation-booking-button:hover,.consultation-booking-button:focus-visible{background:#1d4ed8;transform:translateY(-1px);box-shadow:0 8px 20px rgba(37,99,235,.20)}\
.team-card-booking-link:focus-visible,.team-qa-booking-link:focus-visible,.consultation-booking-button:focus-visible{outline:3px solid #93c5fd;outline-offset:2px}\
.clean-contact-method::before{background:linear-gradient(90deg,#2563eb,#60a5fa)!important}\
.consultation-team-booking{padding-top:28px!important}\
.consultation-team-booking-inner{max-width:1180px;margin:0 auto}\
.consultation-team-booking-head{text-align:center;max-width:760px;margin:0 auto 34px}\
.consultation-team-booking-head h2{margin:.35rem 0 .75rem}\
.consultation-team-booking-head p:last-child{margin:0;color:#66758a;font-size:1.05rem;line-height:1.65}\
.consultation-team-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:20px}\
.consultation-team-card{flex:1 1 205px;max-width:230px;min-width:195px;display:flex;flex-direction:column;align-items:center;text-align:center;padding:24px 20px;border:1px solid #dfe7ef;border-radius:20px;background:#fff;box-shadow:0 14px 34px rgba(21,43,70,.08)}\
.consultation-team-photo{width:96px;height:96px;border-radius:50%;object-fit:cover;margin-bottom:16px;border:4px solid rgba(37,99,235,.12)}\
.consultation-team-card h3{margin:0 0 6px;color:#10233f;font-size:1.15rem}\
.consultation-team-role{min-height:42px;margin:0 0 18px;color:#64748b;font-size:.86rem;font-weight:800;line-height:1.35;text-transform:uppercase;letter-spacing:.055em}\
.consultation-booking-button{width:100%;margin-top:auto}\
@media(max-width:620px){.consultation-team-booking{padding-left:20px!important;padding-right:20px!important}.consultation-team-card{max-width:100%;flex-basis:100%}}';
    document.head.appendChild(style);
  }

  function setBookingLink(link,profile){
    if(!link||!profile)return;
    link.classList.remove('is-placeholder','microsoft-bookings-button');
    link.textContent='Book a Meeting';
    link.href=profile.booking;
    link.target='_blank';
    link.rel='noopener';
    link.removeAttribute('aria-disabled');
    link.setAttribute('aria-label','Book a meeting with '+profile.name);
  }

  function syncTeamCards(){
    document.querySelectorAll('.team-card').forEach(function(card){
      var trigger=card.querySelector('.team-photo-button');
      var linkedin=card.querySelector('.linkedin-link');
      if(!trigger||!linkedin)return;
      var profile=byName[trigger.getAttribute('data-team-person')];
      if(!profile)return;

      var actions=card.querySelector('.team-card-actions');
      if(!actions){
        actions=document.createElement('div');
        actions.className='team-card-actions';
        linkedin.parentNode.insertBefore(actions,linkedin);
        actions.appendChild(linkedin);
      }

      var links=actions.querySelectorAll('.team-card-booking-link');
      var bookingLink=links[0];
      if(!bookingLink){
        bookingLink=document.createElement('a');
        bookingLink.className='team-card-booking-link';
        actions.appendChild(bookingLink);
      }
      for(var i=1;i<links.length;i+=1){links[i].remove();}
      setBookingLink(bookingLink,profile);
    });
  }

  function syncModal(){
    var modal=document.getElementById('teamQaModal');
    if(!modal)return;
    var linkedin=document.getElementById('teamQaLinkedin');
    if(!linkedin)return;

    var actions=modal.querySelector('.team-qa-actions');
    if(!actions){
      actions=document.createElement('div');
      actions.className='team-qa-actions';
      linkedin.parentNode.insertBefore(actions,linkedin);
      actions.appendChild(linkedin);
    }

    var bookingLink=actions.querySelector('.team-qa-booking-link');
    if(!bookingLink){
      bookingLink=document.createElement('a');
      bookingLink.className='team-qa-booking-link';
      bookingLink.hidden=true;
      actions.appendChild(bookingLink);
    }

    document.querySelectorAll('.team-photo-button').forEach(function(trigger){
      trigger.addEventListener('click',function(){
        var profile=byName[trigger.getAttribute('data-team-person')];
        if(!profile)return;
        setBookingLink(bookingLink,profile);
        bookingLink.hidden=false;
      });
    });
  }

  function buildConsultationDirectory(){
    var contactSection=document.querySelector('.clean-contact-section');
    if(!contactSection||document.getElementById('team-booking-directory'))return;

    var heroCopy=document.querySelector('.clean-contact-hero p:not(.eyebrow)');
    if(heroCopy){heroCopy.textContent='Choose a team member to schedule directly, or reach Gotham by phone or email.';}

    var section=document.createElement('section');
    section.className='section consultation-team-booking';
    section.id='team-booking-directory';
    section.setAttribute('aria-labelledby','team-booking-title');

    var inner=document.createElement('div');
    inner.className='consultation-team-booking-inner';

    var head=document.createElement('div');
    head.className='consultation-team-booking-head';
    head.innerHTML='<p class="eyebrow">Schedule Directly</p><h2 id="team-booking-title">Choose who you would like to meet with.</h2><p>Select a Gotham team member to open their Microsoft Bookings calendar and choose an available time.</p>';
    inner.appendChild(head);

    var grid=document.createElement('div');
    grid.className='consultation-team-grid';
    grid.setAttribute('aria-label','Gotham team booking options');

    profiles.forEach(function(profile){
      var card=document.createElement('article');
      card.className='consultation-team-card';

      var image=document.createElement('img');
      image.className='consultation-team-photo';
      image.src=profile.photo;
      image.alt=profile.name;
      image.loading='lazy';
      image.decoding='async';
      image.width=800;
      image.height=800;

      var name=document.createElement('h3');
      name.textContent=profile.name;

      var role=document.createElement('p');
      role.className='consultation-team-role';
      role.textContent=profile.role;

      var link=document.createElement('a');
      link.className='consultation-booking-button';
      setBookingLink(link,profile);

      card.appendChild(image);
      card.appendChild(name);
      card.appendChild(role);
      card.appendChild(link);
      grid.appendChild(card);
    });

    inner.appendChild(grid);
    section.appendChild(inner);
    contactSection.insertAdjacentElement('beforebegin',section);
  }

  function init(){
    addStyles();
    syncTeamCards();
    syncModal();
    buildConsultationDirectory();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();
