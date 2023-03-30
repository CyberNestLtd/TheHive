(function() {
    'use strict';

    angular.module('theHiveControllers').controller('ProfileListCtrl',
        function($uibModal, ProfileSrv, NotificationSrv, ModalSrv, i18n) {
            var self = this;

            self.load = function() {
                ProfileSrv.list()
                    .then(function(response) {
                        self.list = response.data;
                    })
                    .catch(function(rejection) {
                        NotificationSrv.error(i18n.t("controllers.admin.profile.ProfileListCtrl.profile_management", "Profile management"), rejection.data, rejection.status);
                    });
            };

            self.showProfile = function(mode, profile) {
                var modal = $uibModal.open({
                    controller: 'ProfileModalCtrl',
                    controllerAs: '$modal',
                    templateUrl: 'views/partials/admin/profile/profile.modal.html',
                    size: 'lg',
                    resolve: {
                        profile: profile,
                        mode: function(){
                            return mode;
                        }
                    }
                });

                modal.result
                    .then(function(profile) {
                        if (mode === 'edit') {
                            self.update(profile.id, profile);
                        } else {
                            self.create(profile);
                        }
                    })
                    .catch(function(err){
                        if (err && !_.isString(err)) {
                            NotificationSrv.error(i18n.t("controllers.admin.profile.ProfileListCtrl.unable_to_save_the_organisation", "Unable to save the organisation."));
                        }
                    });
            };

            self.update = function(id, profile) {
                ProfileSrv.update(id, _.pick(profile, 'permissions'))
                    .then(function(/*response*/) {
                        self.load();
                        NotificationSrv.log(i18n.t("controllers.admin.profile.ProfileListCtrl.profile_updated_successfully", "Profile updated successfully"), 'success');
                    })
                    .catch(function(err) {
                        NotificationSrv.error('Error', i18n.t("controllers.admin.profile.ProfileListCtrl.profile_update_failed", "Profile update failed"), err.status);
                    });
            };

            self.create = function(profile) {
                ProfileSrv.create(profile)
                    .then(function(/*response*/) {
                        self.load();
                        NotificationSrv.log(i18n.t("controllers.admin.profile.ProfileListCtrl.profile_created_successfully", "Profile created successfully"), 'success');
                    })
                    .catch(function(err) {
                        NotificationSrv.error('Error', i18n.t("controllers.admin.profile.ProfileListCtrl.profile_creation_failed", "Profile creation failed"), err.status);
                    });
            };

            self.removeProfile = function(profile) {
                var modalInstance = ModalSrv.confirm(
                    i18n.t("controllers.admin.profile.ProfileListCtrl.remove_profile", "Remove profile"),
                    i18n.t("controllers.admin.profile.ProfileListCtrl.are_you_sure_you_want_to_remove_the_selected_profile", "Are you sure you want to remove the selected profile?"), {
                        flavor: 'danger',
                        okText: i18n.t("controllers.admin.profile.ProfileListCtrl.yes_remove_it", "Yes, remove it")
                    }
                );

                modalInstance.result
                    .then(function() {
                        return ProfileSrv.remove(profile.id);
                    })
                    .then(function( /*response*/ ) {
                        self.load();
                        NotificationSrv.success(
                            i18n.t("controllers.admin.profile.ProfileListCtrl.profile", "Profile") +' '+ profile.name +' '+ i18n.t("controllers.admin.profile.ProfileListCtrl.has_been_successfully_removed.", "has been successfully removed.")
                        );
                    })
                    .catch(function(err) {
                        if (err && !_.isString(err)) {
                            NotificationSrv.error('ProfileListCtrl', err.data, err.status);
                        }
                    });
            };

            self.canDelete = function(profile) {
                return profile.editable === true && profile.name !== 'all' && profile.name !== ProfileSrv.adminProfile;
            };

            self.load();
        });
})();
