Menu.js
=======

Menu(options)
options:
	menus (Array) :
		type (String) : can be input / menu / check / button,
		text (String / Html) : the text on the menu.
		menus (Array) : if menu type is 'menu', menus is required to show submenus.

option in menus can be a lonely string, that means create a button menu.

About menu type
---------------
menu type can be installed with :
	MenuView.menuMap[typename] = CustomMenuView

CustomMenuView
--------------
Not done yet.



events:
	menu:menuClick(SubMenuView) : triggered when a submenu was clicked or showed.
	menu:ButtonClick(ButtonMenuView) : triggered when a buttonmenu was clicked.
	menu:CheckClick(CheckMenuView, isChecked) : triggered when a checkmenu was clicked.
	menu:EnterKey(InputMenuView, input_message) : triggered when input something in the menu and press enter. (not finish yet)
