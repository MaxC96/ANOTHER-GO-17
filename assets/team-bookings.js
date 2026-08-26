(function(){
  'use strict';

  var profiles=[
    {name:'Danya Cohan',role:'Founder & CEO',photo:'assets/images/danya-art-optimized.webp',booking:'https://bookings.cloud.microsoft/bookwithme/user/bf34a3b24a0745c894b038c8042edc94%40gothamtelecom.com?anonymous&ismsaljsauthenabled'},
    {name:'Elie Theodore',role:'Vice President',photo:'assets/images/elie-art-optimized.webp',booking:'https://bookings.cloud.microsoft/bookwithme/user/6024e26f7215492296622584fb568c2c%40gothamtelecom.com?anonymous&ismsaljsauthenabled'},
    {name:'Renso Reyes',role:'Customer Success',photo:'assets/images/renso-art-optimized.webp',booking:'https://bookings.cloud.microsoft/bookwithme/user/3a07f4f281ec43ce84c78b91c66e2f5e%40gothamtelecom.com/meetingtype/MOUtQafnsESZ6zq9LLfjug2?anonymous&ismsaljsauthenabled'},
    {name:'Faith Robinson',role:'Operations Manager',photo:'assets/images/faith-art-optimized.webp',booking:'https://bookings.cloud.microsoft/bookwithme/user/44b1ece85e7741ec95b08ac8ca7264cb%40gothamtelecom.com/meetingtype/iqXhc-CAN06SXWIHV4ekwg2?anonymous&ismsaljsauthenabled'},
    {name:'Roberto Valle',role:'Mobility Analyst & Customer Success',photo:'assets/images/roberto-art-optimized.webp',booking:'https://bookings.cloud.microsoft/bookwithme/user/d3350cf96f2349ed994207e9fca8e8c9%40gothamtelecom.com?anonymous&ismsaljsauthenabled'}
  ];

  var byName={};
  profiles.forEach(function(profile){byName[profile.name]=profile;});
  window.GOTHAM_TEAM_BOOKINGS=profiles.slice();

  function addStyles(){
    if(document.getElementById('team-booking-control-styles'))return;
    var style=document.createElement('style');
    style.id='team-booking-control-styles';
    style.textContent='\
.team-card-actions,.team-qa-actions{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap}\
.team-card-actions{margin-top:14px}\
.team-qa-actions{justify-content:flex-start;margin-top:16px}\
.team-card-actions>.linkedin-link,.team-qa-actions>.team-qa-link{margin:0}\
.team-card-booking-link,.team-qa-booking-link{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 16px;border:0;border-radius:10px;background:#2563eb;color:#fff;text-decoration:none;font-size:.88rem;font-weight:800;line-height:1;transition:transform .2s ease,background .2s ease,box-shadow .2s ease}\
.team-qa-booking-link{min-height:48px;padding:0 20px;border-radius:12px}\
.team-card-booking-link:hover,.team-card-booking-link:focus-visible,.team-qa-booking-link:hover,.team-qa-booking-link:focus-visible{background:#1d4ed8;transform:translateY(-1px);box-shadow:0 8px 20px rgba(37,99,235,.20)}\
.team-card-booking-link:focus-visible,.team-qa-booking-link:focus-visible{outline:3px solid #93c5fd;outline-offset:2px}\
@media(max-width:600px){.team-qa-actions{justify-content:center}}';
    document.head.appendChild(style);
  }

  function setBookingLink(link,profile){
    if(!link||!profile)return;
    link.hidden=false;
    link.className=link.classList.contains('team-qa-booking-link')?'team-qa-booking-link':'team-card-booking-link';
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
      var link=links[0];
      if(!link){
        link=document.createElement('a');
        link.className='team-card-booking-link';
        actions.appendChild(link);
      }
      for(var i=1;i<links.length;i+=1){links[i].remove();}
      setBookingLink(link,profile);
    });
  }

  function syncModal(){
    var modal=document.getElementById('teamQaModal');
    var linkedin=document.getElementById('teamQaLinkedin');
    if(!modal||!linkedin)return;

    var actions=modal.querySelector('.team-qa-actions');
    if(!actions){
      actions=document.createElement('div');
      actions.className='team-qa-actions';
      linkedin.parentNode.insertBefore(actions,linkedin);
      actions.appendChild(linkedin);
    }

    var links=actions.querySelectorAll('.team-qa-booking-link');
    var link=links[0];
    if(!link){
      link=document.createElement('a');
      link.className='team-qa-booking-link';
      link.hidden=true;
      actions.appendChild(link);
    }
    for(var i=1;i<links.length;i+=1){links[i].remove();}

    document.querySelectorAll('.team-photo-button').forEach(function(trigger){
      trigger.addEventListener('click',function(){
        var profile=byName[trigger.getAttribute('data-team-person')];
        if(profile)setBookingLink(link,profile);
      });
    });
  }

  function syncConsultationCards(){
    document.querySelectorAll('.consultation-team-card[data-team-person]').forEach(function(card){
      var profile=byName[card.getAttribute('data-team-person')];
      if(!profile)return;
      var image=card.querySelector('.consultation-team-photo');
      var name=card.querySelector('h3');
      var role=card.querySelector('.consultation-team-role');
      var link=card.querySelector('.consultation-booking-button');
      if(image){image.src=profile.photo;image.alt=profile.name;}
      if(name)name.textContent=profile.name;
      if(role)role.textContent=profile.role;
      if(link){
        link.textContent='Book a Meeting';
        link.href=profile.booking;
        link.target='_blank';
        link.rel='noopener';
        link.setAttribute('aria-label','Book a meeting with '+profile.name);
      }
    });
  }

  function init(){
    addStyles();
    syncTeamCards();
    syncModal();
    syncConsultationCards();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
