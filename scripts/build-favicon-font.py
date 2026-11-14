from fontTools.fontBuilder import FontBuilder
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.colorLib.builder import buildCOLR, buildCPAL
from pathlib import Path
source=TTFont('C:/Windows/Fonts/georgia.ttf')
glyphs=source.getGlyphSet()
bounds=BoundsPen(glyphs); glyphs['g'].draw(bounds)
x0,y0,x1,y1=bounds.bounds
scale=660/(y1-y0)
pen=TTGlyphPen(glyphs)
glyphs['g'].draw(TransformPen(pen,(scale,0,0,scale,500-(x0+x1)*scale/2,-40-y0*scale)))
letter=pen.glyph()
p=TTGlyphPen(None)
p.moveTo((180,-40));p.lineTo((820,-40));p.qCurveTo((960,-40),(960,100));p.lineTo((960,740));p.qCurveTo((960,880),(820,880));p.lineTo((180,880));p.qCurveTo((40,880),(40,740));p.lineTo((40,100));p.qCurveTo((40,-40),(180,-40));p.closePath()
background=p.glyph()
background.coordinates.translate((0,-140))
empty=TTGlyphPen(None).glyph()
f=FontBuilder(1000,isTTF=True)
f.setupGlyphOrder(['.notdef','favicon','background','letter'])
f.setupCharacterMap({ord('g'):'favicon',ord('G'):'favicon'})
f.setupGlyf({'.notdef':empty,'favicon':empty,'background':background,'letter':letter})
# Keep layer bearings aligned: COLR layers share the same origin.
for name in ['background', 'letter']:
    glyph = f.font['glyf'][name]
    glyph.recalcBounds(f.font['glyf'])
f.setupHorizontalMetrics({n:(1000, getattr(f.font['glyf'][n], 'xMin', 0)) for n in ['.notdef','favicon','background','letter']})
f.setupHorizontalHeader(ascent=900,descent=-100)
f.setupNameTable({'familyName':'Favicon Easter Egg','styleName':'Regular','uniqueFontIdentifier':'FaviconEasterEgg1','fullName':'Favicon Easter Egg','psName':'FaviconEasterEgg'})
f.setupOS2(sTypoAscender=900,sTypoDescender=-100,usWinAscent=900,usWinDescent=100)
f.setupPost()
f.font['COLR']=buildCOLR({'favicon':[('background',0),('letter',1)]},version=0)
f.font['CPAL']=buildCPAL([[(36/255,69/255,43/255,1),(1,253/255,243/255,1)]])
f.font.flavor=None
f.save('public/favicon-letters.ttf')

