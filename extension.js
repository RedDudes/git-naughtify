/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = 'my-indicator-extension';

const { GObject, St } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Gio = imports.gi.Gio;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const _ = ExtensionUtils.gettext;

const Indicator = GObject.registerClass(
    class Indicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, _('My Shiny Indicator'));
            let icon = new St.Icon({
                style_class: 'system-status-icon',
            })
            icon.gicon = Gio.icon_new_for_string(`${Me.path}/giticon.svg`);
            this.add_child(icon);

            // check whether user is logged into github account
            var loggedIn = true;
            if (loggedIn == true) {
                this.notifPanel();
            }
            else {
                this.loginPanel();
            }
        }

        // function to build notification panel once user logged into github account
        notifPanel() {
            let pr = new PopupMenu.PopupMenuItem(_('PR'));
            let mention = new PopupMenu.PopupMenuItem(_('Mention'));
            let review = new PopupMenu.PopupMenuItem(_('Review'));
            let issue = new PopupMenu.PopupMenuItem(_('Assigned Issue'));
            pr.connect('activate', () => {
                Main.notify(_('Pr Notifications'));
            });
            mention.connect('activate', () => {
                Main.notify(_('Mention Notifications'));
            });
            review.connect('activate', () => {
                Main.notify(_('Review Notifications'));
            });
            issue.connect('activate', () => {
                Main.notify(_('Issue Notifications'));
            });
            this.menu.addMenuItem(pr);
            this.menu.addMenuItem(mention);
            this.menu.addMenuItem(review);
            this.menu.addMenuItem(issue);
        }

        // function to build login panel if user is not logged in
        loginPanel() {
            let login = new PopupMenu.PopupMenuItem(_('Please LogIn to your Github Account'));
            login.connect('activate', () => {
                //Main.notify(_('Pr Notifications'));
            });
            this.menu.addMenuItem(login);
        }

    });

class Extension {
    constructor(uuid) {
        this._uuid = uuid;
        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
