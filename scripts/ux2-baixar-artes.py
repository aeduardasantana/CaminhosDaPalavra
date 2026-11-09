#!/usr/bin/env python3
"""Gera recursos gráficos locais licenciados para o UX 2.0."""
from pathlib import Path
from io import BytesIO
from urllib.parse import urlencode
from urllib.request import urlopen, Request
import json
from PIL import Image, ImageOps, ImageEnhance, ImageDraw

OUT = Path("assets/ux2")
OUT.mkdir(parents=True, exist_ok=True)
SOURCES = {
 "cristo": ("Ac-christ.jpg", "domínio público", "Wikimedia Commons"),
 "vaticano": ("Saint Peter's Basilica and Saint Peter's Square, Rome (sunset).jpg", "Quentin Lowagie / Klow, CC BY 4.0", "Wikimedia Commons"),
 "biblia": ("Bible-706658.jpg", "James Chan, CC0", "Wikimedia Commons"),
 "estudo": ("Manuscript without cover.jpg", "Godfried Croenen, CC0", "Wikimedia Commons"),
 "liturgia": ("Valencia - Catedral, Santo Cáliz 2.jpg", "Zarateman, CC0", "Wikimedia Commons"),
 "missa": ("St. Mary's Iowa City Interior.jpg", "Farragutful, domínio público", "Wikimedia Commons"),
 "formacao": ("Old books in library.jpg", "CC0", "Wikimedia Commons"),
 "jornada": ("Path up Sunrise Mountain.png", "Timmal122, CC0", "Wikimedia Commons")
}
UA = "CaminhosDaPalavra-UX2/1.0 (https://github.com/aeduardasantana/CaminhosDaPalavra)"
def request(url):
 req=Request(url,headers={"User-Agent":UA})
 with urlopen(req,timeout=40) as response:
  return response.read(10000000)
def get_image(filename):
 params=urlencode({"action":"query","format":"json","prop":"imageinfo","iiprop":"url","iiurlwidth":"1050","titles":"File:"+filename})
 info=json.loads(request("https://commons.wikimedia.org/w/api.php?"+params))
 page=next(iter(info["query"]["pages"].values()))
 details=page["imageinfo"][0]
 url=details.get("thumburl",details["url"])
 image=Image.open(BytesIO(request(url)));image.load()
 return image.convert("RGB")
def tint(image):
 return ImageEnhance.Contrast(ImageEnhance.Color(image).enhance(.82)).enhance(1.06)
def card(image,name):
 im=tint(ImageOps.fit(image,(640,350),method=Image.Resampling.LANCZOS))
 over=Image.new("RGBA",im.size,(0,0,0,0));d=ImageDraw.Draw(over)
 for y in range(im.height):
  a=int(185*max(0,(y/im.height-.3))/.7)
  d.line((0,y,im.width,y),fill=(26,9,5,min(210,a)))
 im=Image.alpha_composite(im.convert("RGBA"),over).convert("RGB")
 im.save(OUT/(name+"-foto.webp"),"WEBP",quality=75,method=6)
def hero(christ,vatican):
 w,h=1500,310
 base=Image.new("RGB",(w,h),(79,43,28))
 left=tint(ImageOps.fit(christ,(530,h),centering=(.5,.32)))
 right=tint(ImageOps.fit(vatican,(630,h),centering=(.5,.53)))
 for image,xpos,leftside in ((left,0,True),(right,w-630,False)):
  mask=Image.new("L",image.size);draw=ImageDraw.Draw(mask);sw=image.width
  for x in range(sw):
   a=255 if (x<sw*.56 if leftside else x>sw*.44) else int(255*(max(0,(sw-x)/(sw*.44)) if leftside else max(0,x/(sw*.44))))
   draw.line((x,0,x,h),fill=max(0,min(255,a)))
  base.paste(image,(xpos,0),mask)
 base.save(OUT/"hero-foto.webp","WEBP",quality=78,method=6)
def main():
 pictures={}
 lines=["# Créditos e licenças — UX 2.0","",
        "Imagens provenientes do Wikimedia Commons, localmente redimensionadas, recortadas e tonalizadas. A reutilização segue as licenças citadas.",""]
 for name,(filename,license,source) in SOURCES.items():
  pictures[name]=get_image(filename)
  print(name,pictures[name].size)
  lines.append("- "+name+": "+license+". "+source+": https://commons.wikimedia.org/wiki/File:"+filename.replace(" ","_"))
 hero(pictures["cristo"],pictures["vaticano"])
 for key in ("biblia","estudo","liturgia","missa","formacao","jornada"):
  card(pictures[key],key)
 (OUT/"CREDITOS.md").write_text("\n".join(lines)+"\n",encoding="utf-8")
if __name__=="__main__": main()
