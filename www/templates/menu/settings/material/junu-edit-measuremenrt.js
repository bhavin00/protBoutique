
<div class="managecustomer-right-bx">
    <form name="materialForm" novalidate>
        <div class="order-form-left-section add-new-form">

            <div class="form-section-box form-section-box-2">

                <div class="form-box">
                    <label><em id="mandatory" style="color:Red">*</em>Material Type</label>
                    <input id="username" name="title" required placeholder="Material Type" type="text"  ng-pattern="/^[a-zA-Z0-9 ]+$/" ng-model="vm.material.title" ng-minlength="2" ng-maxlength="30">
                    <span ng-if="(materialForm.title.$dirty || vm.isSubmitted) && materialForm.title.$error.pattern">No special characters are allowed.</span>
                    <span ng-if="(materialForm.title.$dirty || vm.isSubmitted) && materialForm.title.$error.required"><i><b>Material Type</b></i> is required.</span>
                    <span ng-if="(materialForm.title.$dirty || vm.isSubmitted) && materialForm.title.$error.minlength"><i><b>Material Type</b></i> should be at least 2 characters long.</span>
                    <span ng-if="(materialForm.title.$dirty || vm.isSubmitted) && materialForm.title.$error.maxlength"><i><b>Material Type</b></i> should not be more than 30 characters long.</span>

                </div>
                <div class="form-box">
                    <label>Is Active</label>
                    <input ng-model="vm.material.isActive" class="billing-addres-checkbox clothcheck" type="checkbox">
                </div>
               
                <div class="register-btm-btn-box register-btm-btn-box-left-mar">
                    <div class="submit-error" ng-if="vm.error">
                        <span>{{vm.error}}</span>
                    </div>
                    <div class="submit-button">
                        <input ng-disabled="vm.startProcessing" value="Save" class="register-submit-btn" type="button" ng-click="vm.save(materialForm)">
                    </div>
                    <div class="cancel-button">
                        <input value="Cancel" class="register-cancel-btn" type="button" ui-sref="app.material">
                    </div>
                </div>

            </div>





        </div>
    </form>
</div>
        </div>