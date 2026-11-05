"""Kit-specific geometry sketches. Labels explain purpose; never imply game scale."""
from html import escape

def special_diagram(c):
 key=c['id'];slug=c['slug']
 def text(x,y,s):return f'<text x="{x}" y="{y}" text-anchor="middle">{escape(s)}</text>'
 def unit(x,y,s,enemy=False):
  shape=f'<rect x="{x-17}" y="{y-17}" width="34" height="34" fill="var(--foe)"/>' if enemy else f'<circle cx="{x}" cy="{y}" r="18" fill="var(--blue)"/>'
  return shape+text(x,y+45,s)
 def line(x,y,x2,y2):return f'<path d="M{x},{y} L{x2},{y2}" fill="none" stroke="currentColor" stroke-width="3" marker-end="url(#special-{slug})"/>'
 def ring(x,y,r,label):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="none" stroke="var(--muted)" stroke-dasharray="5 5"/>'+text(x,y-r-12,label)
 if key=='Xayah':
  caption='Feathers return toward Xayah. Move so the target lies across several return lines before using Bladecaller; feathers beyond the target are useful only if their paths cross it.'
  art=unit(70,190,'Xayah')+unit(260,155,'Target',True)
  for y in (105,130,155):art+=f'<path d="M400,{y-12} l10,12 -10,12 -10,-12 Z" fill="var(--foe)"/>'+line(390,y,90,190)
  art+=text(385,250,'Feathers')
 elif key=='Orianna':
  caption='Orianna and the ball have separate positions. The ball can threaten enemies from an allied carrier while Orianna stays behind; verify the ball location before Shockwave.'
  art=unit(65,200,'Orianna')+unit(275,155,'Ally + ball')+unit(365,100,'Enemy',True)+ring(275,155,70,'Ball area')+line(90,195,240,165)
 elif key=='Gangplank':
  caption='Start with a barrel your team can protect, then connect pressure toward the enemy. The circles illustrate a chain, not the exact link distance. Enemies can contest the trigger barrel.'
  art=unit(55,190,'You')+unit(395,175,'Enemy',True)
  for x in (150,250,350):art+=ring(x,125,53,'')+f'<rect x="{x-10}" y="115" width="20" height="20" fill="var(--blue)"/>'
  art+=line(85,180,140,135)+text(230,260,'Protect the first barrel')
 elif key=='Gnar':
  caption='In Mega form, choose a slam direction that sends an enemy into terrain. A target beside a wall is different from a target with open ground behind them. Check rage and ally follow-up first.'
  art='<rect x="390" y="40" width="35" height="195" fill="var(--muted)"/>'+text(385,270,'Wall')+unit(120,160,'Mega Gnar')+unit(285,160,'Enemy',True)+line(150,155,365,155)
 elif key=='Anivia':
  caption='Use the wall to divide enemy movement while leaving allies an exit. Place the storm where opponents must cross or remain; a wall behind your own team can remove their retreat.'
  art=unit(65,200,'You')+unit(150,140,'Ally')+unit(340,130,'Enemy',True)+ring(325,130,70,'Storm')+'<rect x="240" y="50" width="20" height="120" fill="var(--muted)"/>'+line(160,220,65,250)+text(310,260,'Leave an exit')
 elif key=='Azir':
  caption='Soldiers threaten their nearby attack area while Azir stands farther back. Keep a useful soldier position for damage and retreat; moving every soldier forward can remove your safe zone.'
  art=unit(65,190,'Azir')+unit(350,150,'Enemy',True)+ring(280,145,62,'Soldier zone')+f'<path d="M280,120 l18,30 h-36 Z" fill="var(--blue)"/>'+line(90,185,250,150)
 elif key=='Yone':
  caption='Soul Unbound leaves a fixed return point. The outward path can threaten an enemy, but the return goes back to the body. Start from a place enemies cannot easily occupy.'
  art=unit(65,190,'Body')+unit(280,110,'Spirit')+unit(390,160,'Enemy',True)+line(90,180,250,120)+line(250,150,90,220)+text(220,270,'Check both positions')
 elif key=='Zed':
  caption='A shadow creates another firing angle and a possible swap location. Keep the return position useful: the same visible location that enables your escape can also be watched by enemies.'
  art=unit(65,190,'Shadow')+unit(250,100,'Zed')+unit(385,170,'Enemy',True)+line(90,188,355,175)+line(275,110,360,155)+text(230,270,'Do not abandon the exit')
 else:return None
 svg=f'<svg class="champion-diagram" viewBox="0 0 460 300" role="img" aria-labelledby="special-title-{slug} special-desc-{slug}" xmlns="http://www.w3.org/2000/svg"><title id="special-title-{slug}">{escape(c["title"])}: kit positioning</title><desc id="special-desc-{slug}">{escape(caption)}</desc><defs><marker id="special-{slug}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="currentColor"/></marker></defs><rect x="1" y="1" width="458" height="298" rx="12" fill="var(--tint)" stroke="var(--line)"/>{art}</svg>'
 return svg,caption
