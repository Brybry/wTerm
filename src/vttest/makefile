# $Id: makefile.in,v 1.43 2010/08/28 12:16:45 tom Exp $
# Makefile-template for 'vttest'

THIS = vttest

#### Start of system configuration section. ####

srcdir = .


x		= 
o		= .o

CC		= /opt/PalmPDK/arm-gcc/bin/arm-none-linux-gnueabi-gcc
CPP		= /opt/PalmPDK/arm-gcc/bin/arm-none-linux-gnueabi-gcc -E
LINK		= $(CC)
LINT		= 
INSTALL 	= /usr/bin/install -c
INSTALL_PROGRAM = ${INSTALL}
INSTALL_DATA	= ${INSTALL} -m 644
transform	= s,x,x,

LIBS		= 
CFLAGS		= -g -O2 
LDFLAGS 	= 

CTAGS 		= ctags
ETAGS 		= etags

prefix		= /usr/local
exec_prefix	= ${prefix}

bindir		= $(DESTDIR)${exec_prefix}/bin
mandir		= $(DESTDIR)${prefix}/man/man$(manext)
manext		= 1

#### End of system configuration section. ####

SHELL		= /bin/sh

CPPFLAGS 	= -DHAVE_CONFIG_H -I. -I$(srcdir)  -D_GNU_SOURCE

################################################################################
.SUFFIXES : $o .i .html .$(manext) .cat .ps .pdf .txt

.c$o:
	
	$(CC) -c $(CPPFLAGS) $(CFLAGS) $<

.c.i :
	
	$(CPP) -C $(CPPFLAGS) $*.c >$@

.$(manext).cat :
	- nroff -man $(srcdir)/$(THIS).$(manext) >$@

.$(manext).html :
	GROFF_NO_SGR=stupid $(SHELL) -c "tbl $*.$(manext) | groff -Thtml -man" >$@

.$(manext).ps :
	$(SHELL) -c "tbl $*.$(manext) | groff -man" >$@

.$(manext).txt :
	GROFF_NO_SGR=stupid $(SHELL) -c "tbl $*.$(manext) | nroff -Tascii -man | col -bx" >$@

.ps.pdf :
	ps2pdf $*.ps
################################################################################

C_SRC = \
	charsets.c \
	color.c \
	draw.c \
	esc.c \
	keyboard.c \
	main.c \
	mouse.c \
	nonvt100.c \
	printer.c \
	reports.c \
	reset.c \
	setup.c \
	sixel.c \
	status.c \
	tek4014.c \
	ttymodes.c \
	unix_io.c \
	utf8.c \
	vt220.c \
	vt320.c \
	vt420.c \
	vt52.c \
	vt520.c \
	xterm.c
H_SRC = \
	vttest.h \
	draw.h \
	esc.h \
	ttymodes.h
OBJS  = \
	charsets$o \
	color$o \
	draw$o \
	esc$o \
	keyboard$o \
	main$o \
	mouse$o \
	nonvt100$o \
	printer$o \
	reports$o \
	reset$o \
	setup$o \
	sixel$o \
	status$o \
	tek4014$o \
	ttymodes$o \
	unix_io$o \
	utf8$o \
	vt220$o \
	vt320$o \
	vt420$o \
	vt52$o \
	vt520$o \
	xterm$o

SRC =	patchlev.h \
	CHANGES COPYING README BUGS \
	$(THIS).1 \
	$(C_SRC) $(H_SRC) \
	tech.set \
	config.hin install.sh makefile.in configure.in

TRANSFORM_BIN = sed 's/$x$$//'         |sed '$(transform)'|sed 's/$$/$x/'
TRANSFORM_MAN = sed 's/\.$(manext)$$//'|sed '$(transform)'|sed 's/$$/.$(manext)/'

actual_bin = `echo $(THIS)$x        | $(TRANSFORM_BIN)`
actual_man = `echo $(THIS).$(manext)| $(TRANSFORM_MAN)`

PROG	= $(THIS)$x

DISTFILES = MANIFEST configure $(SRC)

all:	$(PROG)

$(PROG): $(OBJS)
	$(LINK) $(CFLAGS) $(LDFLAGS) -o $(PROG) $(OBJS) $(LIBS)

$(OBJS): config.h $(THIS).h patchlev.h

install: all installdirs
	$(INSTALL_PROGRAM) $(PROG) $(bindir)/$(actual_bin)
	$(INSTALL_DATA) $(srcdir)/$(THIS).1 $(mandir)/$(actual_man)

installdirs: $(bindir) $(mandir)

$(bindir) $(mandir) :
	mkdir -p $@

uninstall:
	rm -f $(bindir)/$(actual_bin)
	rm -f $(mandir)/$(actual_man)

mostlyclean:
	rm -f *.[oi] core *~ *.BAK *.trace *.atac

clean: mostlyclean
	rm -f $(PROG)

distclean: clean
	rm -f makefile config.log config.cache config.status config.h

realclean: distclean
	rm -f tags TAGS # don't remove configure!

tags:	$(C_SRC) $(HDRS)
	$(CTAGS) $(C_SRC) $(HDRS)

TAGS:	$(C_SRC) $(HDRS)
	$(ETAGS) $(C_SRC) $(HDRS)

# I keep my sources in RCS, and assign a symbolic release to the current patch
# level.  The 'manifest' script knows how to build a list of files for a given
# revision.
MANIFEST: patchlev.h
	manifest -rd`fgrep PATCH_DATE patchlev.h | sed -e s'/^[^0-9]*//'`

dist: MANIFEST
	- rm -f .fname .files
	fgrep PATCH_DATE patchlev.h | sed -e 's/[^0-9.]//g' -e 's/^/$(THIS)-/' >.fname
	cat MANIFEST | grep ' ' | egrep -v ' subdirectory$$' | sed -e 's/\ .*//' | uniq >.files
	rm -rf `cat .fname`
	TOP=`cat .fname`; mkdir $$TOP `cat .files | grep / | sed -e 's@/.*@@' | sed -e s@\^@$$TOP/@ | uniq`
	for file in `cat .files`; do \
	  ln $(srcdir)/$$file `cat .fname`/$$file \
	    || { echo copying $$file instead; cp $$file `cat .fname`/$$file; }; \
	done
	tar -cf - `cat .fname` | gzip >`cat .fname`.tgz
	rm -rf `cat .fname` .fname .files

# Some of the output will be uuencoded because the test scripts include
# <CR><LF> terminated ".bat" files for MS-DOS.
dist-shar: MANIFEST
	- rm -f .fname .files
	fgrep PATCH_DATE patchlev.h | sed -e 's/[^0-9.]//g' -e 's/^/$(THIS)-/' >.fname
	cat MANIFEST | grep ' ' | egrep -v ' subdirectory$$' | sed -e 's/\ .*//' | uniq >.files
	shar -M -n`cat .fname` -opart -l50 `cat .files`
	- rm -f .fname .files

$(THIS)$o:	config.h

################################################################################
docs :: $(THIS).html \
	$(THIS).pdf \
	$(THIS).ps \
	$(THIS).txt
$(THIS).html : $(THIS).$(manext)
$(THIS).pdf : $(THIS).ps
$(THIS).ps : $(THIS).$(manext)
$(THIS).txt : $(THIS).$(manext)
################################################################################

lint:
	$(LINT) $(CPPFLAGS) $(C_SRC)

check: $(PROG)
	@echo 'Sorry -- You must run this interactively.'
