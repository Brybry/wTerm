/**
 * This file is part of SDLTerminal.
 * Copyright (C) 2012 Will Dietz <webos@wdtz.org>
 *
 * SDLTerminal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * SDLTerminal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with SDLTerminal.  If not, see <http://www.gnu.org/licenses/>.
 */

#ifndef _SDLFONTGL_H_
#define _SDLFONTGL_H_

#include <GLES/gl.h>
#include <SDL/SDL.h>
#include <SDL/SDL_ttf.h>

#define RENDER_BUFFER_SIZE (1 << 12)

// OpenGL Font Rendering
class SDLFontGL {
public:
	typedef struct {
		unsigned int font;
		unsigned int fg;
		unsigned int bg;
		bool blink;
	} TextGraphicsInfo_t;
private:
	// Master font rendering texture.
	GLuint GlyphCache;
	int texW, texH;

	// Dirty bit for each cache line
	bool * haveCacheLine;

	unsigned int nFonts, nCols;
	TTF_Font** fnts;
	SDL_Color* cols;
	int nWidth, nHeight;

	GLfloat colorValues[RENDER_BUFFER_SIZE*24];
	GLfloat texValues[RENDER_BUFFER_SIZE*12];
	GLfloat vtxValues[RENDER_BUFFER_SIZE*12];
	int numChars;

	/* map slots: from (unicode >> 7) to slot index (or -1 if unsupported) */
	int m_slotMap[512];

	void clearGL();
	void ensureCacheLine(unsigned int font, unsigned int slot);
	bool &hasCacheLine(unsigned int font, unsigned int slot);
	void createTexture();
	void drawBackground(int color, int X, int Y, int cells);
	Uint16 lookupChar(char c);
	void initializeCharMapping();
	void getTextureCoordinates(TextGraphicsInfo_t & graphicsInfo, Uint16 c, int &x, int &y);
	void flushGLBuffer();

public:
	SDLFontGL();
	~SDLFontGL();

	// Indicate what fonts and colors to use
	// This invalidates the cache, so only call when things change.
	void setupFontGL(int fnCount, TTF_Font** fnts, int colCount, SDL_Color *cols);

	// Begin drawing text to the screen
	void startTextGL();
	void drawTextGL(TextGraphicsInfo_t & graphicsInfo, int x, int y, Uint16 cChar);
	// Done drawing text, commit!
	void endTextGL();
};

#endif // _SDLFONTGL_H_