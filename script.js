$(document).ready(function () {
    const form = $('#multiStepForm');
    const steps = form.find('.step');
    const prevButton = form.find('.prev');
    const nextButton = form.find('.next');
    let currentStep = 0;

    updateButtons();

    nextButton.on('click', function () {
        if (validateForm()) {
            $(steps[currentStep]).removeClass('active');
            currentStep++;
            $(steps[currentStep]).addClass('active');
            updateButtons();
        }
    });

    prevButton.on('click', function () {
        $(steps[currentStep]).removeClass('active');
        currentStep--;
        $(steps[currentStep]).addClass('active');
        updateButtons();
    });

    form.on('submit', function (event) {
        if (!validateForm()) {
            event.preventDefault();
        }
    });

    function validateForm() {
        const currentInputs = $(steps[currentStep]).find('input, select');
        let valid = true;
        currentInputs.each(function () {
            if (!this.checkValidity()) {
                this.reportValidity();
                valid = false;
                return false; // Exit each loop early
            }
        });
        return valid;
    }

    function updateButtons() {
        if (currentStep === 0) {
            prevButton.hide();
        } else {
            prevButton.show();
        }

        if (currentStep === steps.length - 1) {
            nextButton.hide();
            form.find('button[type="submit"]').show();
        } else {
            nextButton.show();
            form.find('button[type="submit"]').hide();
        }
    }
});
