enyo.kind({

	name: "wTerm",
	kind: enyo.VFlexBox,
	align: 'center',

	prefs: new Prefs(),
	
	showVKB: true,

	components: [
		{kind: "AppMenu", components: [
			{caption: "About", onclick: "openAbout"},
			{name: 'vkbToggle', caption: "Hide Virtual Keyboard", onclick: 'toggleVKB'},
			{caption: "Preferences", onclick: "openPrefs"}
		]},
		{kind: "ApplicationEvents", onWindowRotated: "setup", onWindowDeactivated: "cancelKeyRepeat", onKeydown: "onBtKeyDown"},
		{
			kind: 'Popup2',
			name: 'about',
			scrim: true,
			components: [
				{style: 'text-align: center; padding-bottom: 12px;', allowHtml: true, content: '<b><u>wTerm v'+enyo.fetchAppInfo().version+'</u></b>'},
				{name: 'fontsize', allowHtml: true, style: 'font-size: 80%;'},
				{name: 'dimensions', allowHtml: true, style: 'font-size: 80%;'},
			]
		}
	],

	initComponents: function() {
    	this.inherited(arguments)
    	this.createComponent({
			name: "prefs", 
			kind: "Preferences", 
			style: "width: 320px; top: 0px; bottom: 0; margin-bottom: 0px;", //width: 384px
			className: "enyo-bg",
			flyInFrom: "right",
			onOpen: "pulloutToggle",
			onClose: "closeRightPullout",
			prefs: this.prefs
		})
		this.createComponent({
    		name: 'terminal',
			kind: 'Terminal',
			prefs: this.prefs,
			bgcolor: '000000',
			width: window.innerWidth,
			height: 400,
		})
		this.createComponent({
			name: "getPreferencesCall",
			kind: "PalmService",
			service: "palm://com.palm.systemservice/",
			method: "getPreferences",
			onSuccess: "prefCallSuccess",
		})
		this.createComponent({kind: 'vkb', name: 'vkb', terminal: this.$.terminal, prefs: this.prefs, showing: true})
		this.$.terminal.vkb = this.$.vkb
		this.$.prefs.terminal = this.$.terminal
		this.$.prefs.vkb = this.$.vkb
		this.setup()
		
		var callback = enyo.bind(this, 'updateBtKeyboardStatus');
		this.$.terminal.$.plugin.addCallback('btKeyboardStatus', callback);
	},

	prefCallSuccess: function(inSender, inResponse) {
		switch (inResponse.rotationLock)
		{
			case 0:  // not locked
				break;
			case 3: // up
			case 4: // down
				this.$.vkb.large()
				if (this.showVKB)
					this.$.terminal.resize(window.innerWidth, 400)
				else
					this.$.terminal.resize(window.innerWidth, window.innerHeight)
				break;
			case 5: // left
			case 6: // right
				this.$.vkb.small()
				if (this.showVKB)
					this.$.terminal.resize(window.innerWidth, 722)
				else
					this.$.terminal.resize(window.innerWidth, window.innerHeight)
				break;
			default:
				break;
		}
	},

	toggleVKB: function() {
		this.showVKB = !this.showVKB
		if (this.showVKB)
			this.$.vkbToggle.setCaption('Hide Virtual Keyboard')
		else
			this.$.vkbToggle.setCaption('Show Virtual Keyboard')
		this.setup()
	},

	openAbout: function() {
		this.$.about.openAtTopCenter()
		d = this.$.terminal.getDimensions()
		this.$.dimensions.setContent('<b>Rows x Cols:</b>  '+d[0]+' x '+d[1])
		this.$.fontsize.setContent('<b>Font Size:</b>  '+this.$.terminal.getFontSize())
	},

	openPrefs: function() {
		//this.$.preferences.openAtTopCenter()
		if (this.$.prefs.showing)
			this.$.prefs.close();
		else {
			//this.$.messages.hasNode();
			//this.$.prefs.domStyles['height'] = this.$.messages.node.clientHeight + 'px';
			this.$.prefs.open();
			this.$.prefs.$.getDevices.call({});
			//this.$.nicks.render();
		}
	},
	
	setup: function() {
		var o = enyo.getWindowOrientation()
		if (o == 'up' || o == 'down') {
			this.$.vkb.large()
			if (this.showVKB)
				this.$.terminal.resize(window.innerWidth, 400)
			else
				this.$.terminal.resize(window.innerWidth, window.innerHeight)
		} else {
			this.$.vkb.small()
			if (this.showVKB)
				this.$.terminal.resize(window.innerWidth, 722)
			else
				this.$.terminal.resize(window.innerWidth, window.innerHeight)
		}

		// fix the keyboard if orientation is locked
		this.$.getPreferencesCall.call({"keys":["rotationLock"]});
	},

	updateBtKeyboardStatus: function(status) {
		this.showVKB = !(status === 'true');
		try {
			if (this.showVKB)
				this.$.vkbToggle.setCaption('Hide Virtual Keyboard');
			else
				this.$.vkbToggle.setCaption('Show Virtual Keyboard');
		} 
		catch (e) { this.log("FIX THIS: "+e);}
		this.setup();
	},

	onBtKeyDown: function(context, event) {
		if (this.$.terminal.$.plugin.hasNode())
		{
			this.$.terminal.$.plugin.node.focus();
			this.$.terminal.$.plugin.node.dispatchEvent(event);
		}
	},

	cancelKeyRepeat: function() {
		this.$.terminal.cancelKeyRepeat();
	}

})
