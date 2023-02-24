# EXECUTABLE BINARIES
TINYCC=tcc
COMPILER=crown
LUA=lua
LUAC=luac
KING=king

#include <crown/lua>
# SOURCE DIRECTORIES AND SOURCE FILES
TINYCC_SOURCE_DIR=tinycc
LUA_SOURCE_DIR=lua-lvm/src
LUASTATE_LIB_DIR=/usr/local/lib/$(COMPILER)
COMPILER_SOURCE_DIR=src
COMPILER_SOURCE_FILE=release.js
LUAH_LIB=lua.h
LUAX_LIB=lauxlib.h
LUACONF_LIB=luaconf.h
LUALIBA_LIB=liblua.a
KING_PATH=utils/$(KING).crown
KING_BIN=utils/$(KING)

# INSTALLATION PROCEDURES
INSTALL=sudo cp -Rfv
INSTALL_PATH=/usr/local/bin
REMOVE=sudo rm -Rfv
PERMISSION=sudo chmod +x
RM=rm -Rfv
MKDIR=mkdir -p


# .MAIN GLOBAL -> INSTALL (stable)
# sudo make all install

# .MAIN GLOBAL -> TinyCC VM (unstable)
# sudo make all tinycc install

# .MAIN GLOBAL -> UNINSTALL
# sudo make remove



# .START GLOBAL
all: lua-lvm luax-shared-libs crown king-utils
	
crown:
	$(INSTALL) $(COMPILER_SOURCE_DIR)/$(COMPILER_SOURCE_FILE) $(COMPILER)
	$(PERMISSION) $(COMPILER)

tinycc:
	cd $(TINYCC_SOURCE_DIR) && $(RM) *.o
	cd $(TINYCC_SOURCE_DIR) && ./configure
	cd $(TINYCC_SOURCE_DIR) && sudo make
	$(INSTALL) $(TINYCC_SOURCE_DIR)/$(TINYCC) $(TINYCC)
	cd $(TINYCC_SOURCE_DIR) && $(RM) *.o

lua-lvm:
	cd $(LUA_SOURCE_DIR) && $(RM) *.o
	cd $(LUA_SOURCE_DIR) && make all test
	$(INSTALL) $(LUA_SOURCE_DIR)/$(LUA) $(LUA)
	$(INSTALL) $(LUA_SOURCE_DIR)/$(LUAC) $(LUAC)
	cd $(LUA_SOURCE_DIR) && $(RM) *.o
luax-shared-libs:
	$(MKDIR) $(LUASTATE_LIB_DIR)
	$(INSTALL) $(LUA_SOURCE_DIR)/$(LUAH_LIB) $(LUASTATE_LIB_DIR)/$(LUAH_LIB)
	$(INSTALL) $(LUA_SOURCE_DIR)/$(LUAX_LIB) $(LUASTATE_LIB_DIR)/$(LUAX_LIB)
	$(INSTALL) $(LUA_SOURCE_DIR)/$(LUACONF_LIB) $(LUASTATE_LIB_DIR)/$(LUACONF_LIB)
	$(INSTALL) $(LUA_SOURCE_DIR)/$(LUALIBA_LIB) $(LUASTATE_LIB_DIR)/$(LUALIBA_LIB)

king-utils:
	$(RM) $(KING_BIN)
	./$(COMPILER) $(KING_PATH)
	$(INSTALL) $(KING_BIN) $(KING)
	$(RM) $(KING_BIN)


install:
	$(INSTALL) $(TINYCC) $(INSTALL_PATH)/$(TINYCC)
	$(INSTALL) $(COMPILER) $(INSTALL_PATH)/$(COMPILER)
	$(INSTALL) $(LUA) $(INSTALL_PATH)/$(LUA)
	$(INSTALL) $(LUAC) $(INSTALL_PATH)/$(LUAC)
	$(INSTALL) $(KING) $(INSTALL_PATH)/$(KING)

remove:
	$(REMOVE) $(INSTALL_PATH)/$(TINYCC)
	$(REMOVE) $(INSTALL_PATH)/$(COMPILER)
	$(REMOVE) $(INSTALL_PATH)/$(LUA)
	$(REMOVE) $(INSTALL_PATH)/$(LUAC)
	$(REMOVE) $(LUASTATE_LIB_DIR)/$(LUAH_LIB)
	$(REMOVE) $(LUASTATE_LIB_DIR)/$(LUAX_LIB)
	$(REMOVE) $(LUASTATE_LIB_DIR)/$(LUACONF_LIB)
	$(REMOVE) $(INSTALL_PATH)/$(KING)


.PHONY: all lua-lvm tinycc luax-shared-libs king-utils install remove