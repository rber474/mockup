import $ from "jquery";
import Pattern from "./pickadate";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

describe("PickADate", function () {
    beforeEach(function () {
        document.body.innerHTML = `
            <div><input class="pat-pickadate" data-pat-pickadate=\'{"autoSetTimeOnDateChange": "false"}\'/></div>
        `;
        Date.now = jest.fn(() =>
            new Date(Date.UTC(2016, 12, 23, 15, 30)).valueOf()
        );
    });

    afterEach(function () {
        document.body.innerHTML = "";
        Date.now.mockClear();
    });

    it("date and time element initialized", function () {
        // pickadate is not initialized
        expect(
            document.querySelectorAll(".pattern-pickadate-wrapper").length
        ).toEqual(0);

        // scan dom for patterns
        registry.scan(document.body);

        // pickadate is initialized
        expect(
            document.querySelectorAll(".pattern-pickadate-wrapper").length
        ).toEqual(1);

        const input_date = document.querySelector(".pattern-pickadate-date");
        const input_time = document.querySelector(".pattern-pickadate-time");

        // date and time inputs are there by default
        expect(input_date).toBeTruthy();
        expect(input_time).toBeTruthy();

        const dateWrapper = input_date.parentNode;
        const timeWrapper = input_time.parentNode;
        const input = document.querySelector(".pat-pickadate");

        // main element is hidden
        expect(input.style.display).toEqual("none");

        // no value on main element
        expect(input.value).toEqual("");

        // no picker is open
        expect(dateWrapper.querySelectorAll(".picker--opened").length).toEqual(0); // prettier-ignore
        expect(timeWrapper.querySelectorAll(".picker--opened").length).toEqual(0); // prettier-ignore
    });

    it("open date picker", async function () {
        registry.scan(document.body);

        const input_date = document.querySelector(".pattern-pickadate-date");
        const input_time = document.querySelector(".pattern-pickadate-time");
        const dateWrapper = input_date.parentNode;
        const timeWrapper = input_time.parentNode;

        // we open date picker (calendar)
        input_date.click();
        await utils.timeout(1);

        // date picker should be opened but not time picker
        expect(dateWrapper.querySelectorAll(".picker--opened").length).toEqual(1); // prettier-ignore
        expect(timeWrapper.querySelectorAll(".picker--opened").length).toEqual(0); // prettier-ignore
    });

    it("select date from picker", async function () {
        registry.scan(document.body);

        const input = document.querySelector(".pat-pickadate");
        const input_date = document.querySelector(".pattern-pickadate-date");
        const input_time = document.querySelector(".pattern-pickadate-time");
        const dateWrapper = input_date.parentNode;
        const timeWrapper = input_time.parentNode;

        // select some date
        input_date.click();
        await utils.timeout(1);

        const selectedDate = dateWrapper.querySelectorAll(".picker__day")[0];
        selectedDate.click();

        // selected date should be saved on date picker element
        expect(input_date.getAttribute("data-value")).toEqual(
            selectedDate.getAttribute("data-pick")
        );

        // since time is not selected we still dont expect main element to have
        // value
        expect(input.value).toEqual("");

        // we open time picker
        input_time.click();
        await utils.timeout(1);

        // time picker should be opened but not date picker
        expect(dateWrapper.querySelectorAll(".picker--opened").length).toEqual(
            0
        );
        expect(timeWrapper.querySelectorAll(".picker--opened").length).toEqual(
            1
        );

        // select some time
        const selectedTime = timeWrapper.querySelectorAll("li")[1];
        selectedTime.click();

        // selected time should be saved on time picker element
        expect(input_time.getAttribute("data-value")).toEqual(
            selectedTime.getAttribute("data-pick")
        );

        // main element should now have value
        expect(input.value).not.toEqual("");
    });

    // We want to replace pat-pickaday with pat-date-picker from Patternslib.
    // So we skip all the tests in here.

    it.skip("date and time picker except custom settings", function () {
        var self = this;

        // custom settings for date and time widget
        $(".pat-pickadate", self.$el).attr(
            "data-pat-pickadate",
            JSON.stringify({
                date: {
                    selectYears: false,
                    selectMonths: false,
                },
                time: {
                    interval: 60,
                },
            })
        );

        // scan dom for patterns
        registry.scan(self.$el);

        // there are not dropdowns to select year or month
        expect(
            $(".pattern-pickadate-date", self.$el)
                .parent()
                .find(".picker__select--year").length
        ).toEqual(0);
        expect(
            $(".pattern-pickadate-date", self.$el)
                .parent()
                .find(".picker__select--month").length
        ).toEqual(0);

        // there should be 24 items for each hour in time picker list.
        // The clear button is not shown in favor of a date + time clear button.
        expect(
            $(".pattern-pickadate-time", self.$el).parent().find("li").length
        ).toEqual(24);
    });

    it.skip("only date element", function () {
        var self = this;

        // add option which disables time picker
        $(".pat-pickadate", self.$el).attr("data-pat-pickadate", "time:false");

        // pickadate is not initialized
        expect($(".pattern-pickadate-wrapper", self.$el).length).toEqual(0);

        // scan dom for patterns
        registry.scan(self.$el);

        // pickadate is initialized
        expect($(".pattern-pickadate-wrapper", self.$el).length).toEqual(1);

        var dateWrapper = $(".pattern-pickadate-date", self.$el).parent();

        // main element is hidden
        expect(self.$el.is(":hidden")).toEqual(true);

        // date input is there by default
        expect($(".pattern-pickadate-date", self.$el).length).toEqual(1);
        expect($(".pattern-pickadate-time", self.$el).length).toEqual(0);

        // no value on main element
        expect(self.$el.val()).toEqual("");

        // date picker is not open
        expect(dateWrapper.find(".picker--opened").length).toEqual(0);

        // we open date picker (calendar)
        $(".pattern-pickadate-date", self.$el).click();

        // date picker should be opened
        this.clock.tick(1000);
        expect(dateWrapper.find(".picker--opened").length).toEqual(1);

        // select some date
        var $selectedDate = dateWrapper.find("td > div").first().click();

        // selected date should be saved on date picker element
        expect(
            $(".pattern-pickadate-date", self.$el).attr("data-value")
        ).toEqual($selectedDate.attr("data-pick"));

        // and also on main element since time element is disabled
        expect($(".pat-pickadate", self.$el).val()).to.not.equal("");
    });

    it.skip("only time element", function () {
        var self = this;

        // add option which disables date picker
        $(".pat-pickadate", self.$el).attr("data-pat-pickadate", "date:false");

        // pickadate is not initialized
        expect($(".pattern-pickadate-wrapper", self.$el).length).toEqual(0);

        // scan dom for patterns
        registry.scan(self.$el);

        // pickadate is initialized
        expect($(".pattern-pickadate-wrapper", self.$el).length).toEqual(1);

        var timeWrapper = $(".pattern-pickadate-time", self.$el).parent();

        // main element is hidden
        expect(self.$el.is(":hidden")).toEqual(true);

        // time input is there by default
        expect($(".pattern-pickadate-date", self.$el).length).toEqual(0);
        expect($(".pattern-pickadate-time", self.$el).length).toEqual(1);

        // no value on main element
        expect(self.$el.val()).toEqual("");

        // time picker is not open
        expect(timeWrapper.find(".picker--opened").length).toEqual(0);

        // we open time picker (calendar)
        $(".pattern-pickadate-time", self.$el).click();

        // time picker should be opened
        this.clock.tick(1000);
        expect(timeWrapper.find(".picker--opened").length).toEqual(1);

        // select some time
        var $selectedTime = timeWrapper.find("li").first().next().click();

        // selected date should be saved on date picker element
        expect(
            $(".pattern-pickadate-time", self.$el).attr("data-value")
        ).toEqual($selectedTime.attr("data-pick"));

        // and also on main element since time element is disabled
        expect($(".pat-pickadate", self.$el).val()).to.not.equal("");
    });

    it.skip("populating date and time picker", function () {
        var self = this;

        // custom settings for date and time widget
        $(".pat-pickadate", self.$el).attr("value", "2001-10-10 10:10");

        // scan dom for patterns
        registry.scan(self.$el);

        // date picker value is parsed correctly from main element ...
        expect(
            $(".pattern-pickadate-date", self.$el).attr("data-value")
        ).toEqual("2001-10-10");

        // ... and make sure 2001-10-10 is picked in the date picker calendar
        expect(
            $(".pattern-pickadate-date", self.$el)
                .parent()
                .find(".picker__select--year > :selected")
                .val()
        ).toEqual("2001");
        expect(
            $(".pattern-pickadate-date", self.$el)
                .parent()
                .find(".picker__select--month > :selected")
                .val()
        ).toEqual("9");
        expect(
            $(".pattern-pickadate-date", self.$el)
                .parent()
                .find(".picker__day--selected")
                .text()
        ).toEqual("10");

        // time picker value is parsed correctly from main element
        expect(
            $(".pattern-pickadate-time", self.$el).attr("data-value")
        ).toEqual("10:10");

        // and make sure 10:00 AM is picked in the time picker list
        expect(
            $(".pattern-pickadate-time", self.$el)
                .parent()
                .find(".picker__list-item--selected")
                .attr("data-pick")
        ).toEqual("630");
    });

    it.skip("populating only time picker", function () {
        var self = this;

        // custom settings for date and time widget
        $(".pat-pickadate", self.$el)
            .attr("value", "15:10")
            .attr("data-pat-pickadate", "date:false");

        // scan dom for patterns
        registry.scan(self.$el);

        // time picker value is parsed correctly from main element
        expect(
            $(".pattern-pickadate-time", self.$el).attr("data-value")
        ).toEqual("15:10");

        // and make sure 10:00 AM is picked in the time picker list
        expect(
            $(".pattern-pickadate-time", self.$el)
                .parent()
                .find(".picker__list-item--selected")
                .attr("data-pick")
        ).toEqual("930");
    });

    it.skip("populating only date picker", function () {
        var self = this;

        // custom settings for date and time widget
        $(".pat-pickadate", self.$el)
            .attr("value", "1801-12-30")
            .attr("data-pat-pickadate", "time:false");

        // scan dom for patterns
        registry.scan(self.$el);

        // date picker value is parsed correctly from main element ...
        expect(
            $(".pattern-pickadate-date", self.$el).attr("data-value")
        ).toEqual("1801-12-30");

        // ... and make sure 1801-12-30 is picked in the date picker calendar
        expect(
            $(".pattern-pickadate-date", self.$el)
                .parent()
                .find(".picker__select--year > :selected")
                .val()
        ).toEqual("1801");
        expect(
            $(".pattern-pickadate-date", self.$el)
                .parent()
                .find(".picker__select--month > :selected")
                .val()
        ).toEqual("11");
        expect(
            $(".pattern-pickadate-date", self.$el)
                .parent()
                .find(".picker__day--selected")
                .text()
        ).toEqual("30");
    });

    it.skip("getting around bug in pickatime when selecting 00:00", function () {
        var self = this;

        // custom settings for time widget
        $(".pat-pickadate", self.$el)
            .attr("value", "00:00")
            .attr("data-pat-pickadate", "date:false");

        registry.scan(self.$el);

        // time picker value is parsed correctly from main element
        expect(
            $(".pattern-pickadate-time", self.$el).attr("data-value")
        ).toEqual("00:00");

        // and make sure 10:00 AM is picked in the time picker list
        expect(
            $(".pattern-pickadate-time", self.$el)
                .parent()
                .find(".picker__list-item--selected")
                .attr("data-pick")
        ).toEqual("0");
    });

    describe("PickADate with timezone", function () {
        it.skip("has date, time and timezone", function () {
            var self = this,
                $input = $(".pat-pickadate", self.$el).attr(
                    "data-pat-pickadate",
                    '{"timezone": {"data": [' +
                        '{"id":"Europe/Berlin","text":"Europe/Berlin"},' +
                        '{"id":"Europe/Vienna","text":"Europe/Vienna"}]},' +
                        '"autoSetTimeOnDateChange": "false"}'
                );
            self.$el.appendTo("body");
            registry.scan($input);

            // date and time should exist by default
            var $timeWrapper = $(".pattern-pickadate-time-wrapper", self.$el),
                $dateWrapper = $(".pattern-pickadate-date-wrapper", self.$el);
            expect($timeWrapper.length).toEqual(1);
            expect($dateWrapper.length).toEqual(1);

            // timezone elements should not be available
            var $results = $("li.select2-result-selectable");
            expect($results.length).toEqual(0);

            var $pattern = $("input.pattern-pickadate-timezone");
            $pattern.on("select2-open", function () {
                // timezone elements should be available
                $results = $("li.select2-result-selectable");
                expect($results.length).toEqual(2);
            });
            $("a.select2-choice").trigger("mousedown");

            // value of main element should be empty
            expect($(".pat-pickadate").val()).toEqual("");

            // after changing timezone the value should still be empty
            $pattern.select2("val", "Europe/Berlin", {
                triggerChange: true,
            });
            expect($pattern.val()).toEqual("Europe/Berlin");
            expect($input.val()).toEqual("");

            // set date and time and check if value of main element gets timezone
            $(".pattern-pickadate-date", self.$el).click();
            $dateWrapper.find("td > div").first().click();
            expect($input.val()).toEqual("");
            $(".pattern-pickadate-time", self.$el).click();
            $timeWrapper.find("li").first().next().click();
            expect($input.val()).toEqual(
                $("input:last", $dateWrapper).val() +
                    " " +
                    $("input:last", $timeWrapper).val() +
                    " " +
                    "Europe/Berlin"
            );

            // change timezone to second value and check if value of main element changes
            $pattern.select2("val", "Europe/Vienna", {
                triggerChange: true,
            });
            expect($pattern.val()).toEqual("Europe/Vienna");
            expect($input.val()).toEqual(
                $("input:last", $dateWrapper).val() +
                    " " +
                    $("input:last", $timeWrapper).val() +
                    " " +
                    "Europe/Vienna"
            );
        });

        it.skip("should take the default timezone when it is set", function () {
            var self = this,
                $input = $(".pat-pickadate", self.$el).attr(
                    "data-pat-pickadate",
                    '{"timezone": {"default": "Europe/Vienna", "data": [' +
                        '{"id":"Europe/Berlin","text":"Europe/Berlin"},' +
                        '{"id":"Europe/Vienna","text":"Europe/Vienna"},' +
                        '{"id":"Europe/Madrid","text":"Europe/Madrid"}' +
                        "]}}"
                );
            self.$el.appendTo("body");
            registry.scan($input);

            // check if data values are set to default
            expect(
                $(".pattern-pickadate-timezone .select2-chosen").text()
            ).toEqual("Europe/Vienna");
            expect(
                $("input.pattern-pickadate-timezone").attr("data-value")
            ).toEqual("Europe/Vienna");
        });

        it.skip("should only set the default value when it exists in the list", function () {
            var self = this,
                $input = $(".pat-pickadate", self.$el).attr(
                    "data-pat-pickadate",
                    '{"timezone": {"default": "Europe/Madrid", "data": [' +
                        '{"id":"Europe/Berlin","text":"Europe/Berlin"},' +
                        '{"id":"Europe/Vienna","text":"Europe/Vienna"}' +
                        "]}}"
                );
            self.$el.appendTo("body");
            registry.scan($input, ["pickadate"]);

            // check if visible and data value are set to default
            expect(
                $(".pattern-pickadate-timezone .select2-chosen").text()
            ).toEqual("Enter timezone...");
            expect(
                $("input.pattern-pickadate-timezone").attr("data-value")
            ).toEqual(undefined);
        });

        it.skip("should write to default and disable the dropdown field if only one value exists", function () {
            var self = this,
                $input = $(".pat-pickadate", self.$el).attr(
                    "data-pat-pickadate",
                    '{"timezone": {"data": [' +
                        '{"id":"Europe/Berlin","text":"Europe/Berlin"}' +
                        "]}}"
                );
            self.$el.appendTo("body");
            registry.scan($input, ["pickadate"]);

            var $time = $(".pattern-pickadate-timezone");

            // check if data values are set to default
            expect($(".select2-chosen", $time).text()).toEqual("Europe/Berlin");
            expect(
                $("input.pattern-pickadate-timezone").attr("data-value")
            ).toEqual("Europe/Berlin");

            expect(
                $(".pattern-pickadate-timezone").data("select2")._enabled
            ).toEqual(false);
            expect($(".select2-container-disabled").length).toEqual(1);
        });
    });

    describe("automatically set the time on changing the date", function () {
        it.skip("parseTimeOffset works as expected", function () {
            var pickadate = new Pattern(
                document.body.querySelector(".pat-pickadate"),
                {}
            );

            // test false/true
            expect(pickadate.parseTimeOffset("false")).toEqual(false);
            expect(pickadate.parseTimeOffset("true")).to.eql([0, 0]);

            // test setting straight to time
            expect(pickadate.parseTimeOffset("[12, 34]")).to.eql([12, 34]);

            // test adding / substracting
            expect(pickadate.parseTimeOffset("+[1, 10]")).to.eql([16, 40]);
            expect(pickadate.parseTimeOffset("-[1, 10]")).to.eql([14, 20]);

            // Test not exceeding dat/hour boundaries
            expect(pickadate.parseTimeOffset("+[10, 10]")).to.eql([23, 40]);
            expect(pickadate.parseTimeOffset("-[16, 10]")).to.eql([0, 20]);
            expect(pickadate.parseTimeOffset("+[1, 40]")).to.eql([16, 59]);
            expect(pickadate.parseTimeOffset("-[1, 40]")).to.eql([14, 0]);
            expect(pickadate.parseTimeOffset("+[1000, 1000]")).to.eql([23, 59]);
            expect(pickadate.parseTimeOffset("-[1000, 1000]")).to.eql([0, 0]);

            // test complete/partly nonsense
            expect(pickadate.parseTimeOffset("blabla")).to.eql([0, 0]);
            expect(pickadate.parseTimeOffset("[10,20]")).to.eql([10, 20]);
            expect(pickadate.parseTimeOffset('[10,"aha"]')).to.eql([10, 0]);
            expect(pickadate.parseTimeOffset('["who", 20]')).to.eql([0, 20]);
        });

        it.skip("sets the time when date is changed per default", function () {
            var $el = $('<div><input class="pat-pickadate" />');
            registry.scan($el);

            var $dateWrapper = $(".pattern-pickadate-date", $el).parent();

            // set date and time and check if time is also set
            $(".pattern-pickadate-date", $el).click();
            var $selectedDate = $dateWrapper.find("td > div").first().click();

            // selected date should be saved on date picker element
            expect(
                $(".pattern-pickadate-date", $el).attr("data-value")
            ).toEqual($selectedDate.attr("data-pick"));

            // default time should be available on time picker element.
            expect(
                $(".pattern-pickadate-time", $el).attr("data-value")
            ).toEqual("15,30");

            // pickadate should be have this value set.
            expect($(".pat-pickadate", $el).val()).to.contain("15:30");
        });

        it.skip("sets the time to a specific value when date is changed", function () {
            var $el = $(
                '<div><input class="pat-pickadate" data-pat-pickadate=\'{"autoSetTimeOnDateChange": "[12,30]"}\'/>'
            );
            registry.scan($el);

            var $dateWrapper = $(".pattern-pickadate-date", $el).parent();

            // set date and time and check if time is also set
            $(".pattern-pickadate-date", $el).click();
            var $selectedDate = $dateWrapper.find("td > div").first().click();

            // selected date should be saved on date picker element
            expect(
                $(".pattern-pickadate-date", $el).attr("data-value")
            ).toEqual($selectedDate.attr("data-pick"));

            // default time should be available on time picker element.
            expect(
                $(".pattern-pickadate-time", $el).attr("data-value")
            ).toEqual("12,30");

            // pickadate should be have this value set.
            expect($(".pat-pickadate", $el).val()).to.contain("12:30");
        });

        it.skip("sets the time to a positive offset of the current time when date is changed", function () {
            var $el = $(
                '<div><input class="pat-pickadate" data-pat-pickadate=\'{"autoSetTimeOnDateChange": "+[1,0]"}\'/>'
            );
            registry.scan($el);

            var $dateWrapper = $(".pattern-pickadate-date", $el).parent();

            // set date and time and check if time is also set
            $(".pattern-pickadate-date", $el).click();
            var $selectedDate = $dateWrapper.find("td > div").first().click();

            // selected date should be saved on date picker element
            expect(
                $(".pattern-pickadate-date", $el).attr("data-value")
            ).toEqual($selectedDate.attr("data-pick"));

            // default time should be available on time picker element.
            expect(
                $(".pattern-pickadate-time", $el).attr("data-value")
            ).toEqual("16,30");

            // pickadate should be have this value set.
            expect($(".pat-pickadate", $el).val()).to.contain("16:30");
        });

        it.skip("sets the time to a negative offset of the current time when date is changed", function () {
            var $el = $(
                '<div><input class="pat-pickadate" data-pat-pickadate=\'{"autoSetTimeOnDateChange": "-[1,0]"}\'/>'
            );
            registry.scan($el);

            var $dateWrapper = $(".pattern-pickadate-date", $el).parent();

            // set date and time and check if time is also set
            $(".pattern-pickadate-date", $el).click();
            var $selectedDate = $dateWrapper.find("td > div").first().click();

            // selected date should be saved on date picker element
            expect(
                $(".pattern-pickadate-date", $el).attr("data-value")
            ).toEqual($selectedDate.attr("data-pick"));

            // default time should be available on time picker element.
            expect(
                $(".pattern-pickadate-time", $el).attr("data-value")
            ).toEqual("14,30");

            // pickadate should be have this value set.
            expect($(".pat-pickadate", $el).val()).to.contain("14:30");
        });
    });

    describe("set / clear date and time with buttons", function () {
        it.skip("set and clear date and time", function () {
            var $el = $('<div><input class="pat-pickadate"/>');
            registry.scan($el);

            // first, it's unset
            expect($(".pat-pickadate", $el).val()).toEqual("");

            // now set it to now.
            $(".pattern-pickadate-now", $el).click();
            // TODO: should test for emitting ``updated.pickadate.patterns``, but our expect framework doesn't support that.
            expect($(".pat-pickadate", $el).val()).toEqual("2017-01-23 15:30");

            // now clear it.
            $(".pattern-pickadate-clear", $el).click();
            // TODO: should test for emitting ``updated.pickadate.patterns``, but our expect framework doesn't support that.
            expect($(".pat-pickadate", $el).val()).toEqual("");
        });

        it.skip("set and clear date", function () {
            var $el = $(
                "<div><input class=\"pat-pickadate\" data-pat-pickadate='date:false'/>"
            );
            registry.scan($el);

            // first, it's unset
            expect($(".pat-pickadate", $el).val()).toEqual("");

            // now set it to now.
            $(".pattern-pickadate-now", $el).click();
            expect($(".pat-pickadate", $el).val()).toEqual("15:30");

            // now clear it.
            $(".pattern-pickadate-clear", $el).click();
            expect($(".pat-pickadate", $el).val()).toEqual("");
        });

        it.skip("set and clear time", function () {
            var $el = $(
                "<div><input class=\"pat-pickadate\" data-pat-pickadate='time:false'/>"
            );
            registry.scan($el);

            // first, it's unset
            expect($(".pat-pickadate", $el).val()).toEqual("");

            // now set it to now.
            $(".pattern-pickadate-now", $el).click();
            expect($(".pat-pickadate", $el).val()).toEqual("2017-01-23");

            // now clear it.
            $(".pattern-pickadate-clear", $el).click();
            expect($(".pat-pickadate", $el).val()).toEqual("");
        });

        it("hide today and clear buttons", function () {
            var $el = $(
                "<div><input class=\"pat-pickadate\" data-pat-pickadate='today:false;clear:false'/>"
            );
            registry.scan($el);
            // today and clear buttons are missing
            expect($(".pattern-pickadate-now", $el).length).toEqual(0);
            expect($(".pattern-pickadate-clear", $el).length).toEqual(0);
        });
    });
});
