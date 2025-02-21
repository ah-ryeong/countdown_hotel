var Countdown = {
    
    // Backbone-like structure
    $el: $('.countdown'),
    
    // Params
    countdown_interval: null,
    total_seconds: 0,
    
    // Initialize the countdown  
    init: function() {
        
        // Calculate remaining time from Jan 1 this year to Jan 1 next year
        const now = new Date();
        const jan1NextYear = new Date(now.getFullYear() + 1, 0, 1); // 내년 1월 1일
        const timeDiff = jan1NextYear - now; // 남은 시간(ms)
        
        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        // DOM
        this.$ = {
            days    : this.$el.find('.bloc-time.days .figure'),
            hours   : this.$el.find('.bloc-time.hours .figure'),
            minutes : this.$el.find('.bloc-time.min .figure'),
            seconds : this.$el.find('.bloc-time.sec .figure')
        };

        // Initialize countdown values
        this.values = {
            days,
            hours,
            minutes,
            seconds
        };

        // Initialize total seconds
        this.total_seconds = days * 24 * 60 * 60 
                         + hours * 60 * 60 
                         + minutes * 60 
                        + seconds;

        // Animate countdown to the end 
        this.count();    
    },
    
    count: function() {
        var that = this,
            $day_1 = this.$.days.eq(0),
            $day_2 = this.$.days.eq(1),
            $day_3 = this.$.days.eq(2),
            $hour_1 = this.$.hours.eq(0),
            $hour_2 = this.$.hours.eq(1),
            $min_1 = this.$.minutes.eq(0),
            $min_2 = this.$.minutes.eq(1),
            $sec_1 = this.$.seconds.eq(0),
            $sec_2 = this.$.seconds.eq(1);
        
        this.countdown_interval = setInterval(function() {
        
        if (that.total_seconds > 0) {
            
            --that.values.seconds;
            
            if (that.values.minutes >= 0 && that.values.seconds < 0) {
                that.values.seconds = 59;
                --that.values.minutes;
            }

            if (that.values.hours >= 0 && that.values.minutes < 0) {
                that.values.minutes = 59;
                --that.values.hours;
            }

            if (that.values.days >= 0 && that.values.hours < 0) {
                that.values.hours = 23;
                --that.values.days;
            }
            
            // Update DOM values
            that.checkThreeDigits(that.values.days, $day_1, $day_2, $day_3);
            that.checkHour(that.values.hours, $hour_1, $hour_2);
            that.checkHour(that.values.minutes, $min_1, $min_2);
            that.checkHour(that.values.seconds, $sec_1, $sec_2);

            --that.total_seconds;
            } else {
                clearInterval(that.countdown_interval);
            }
        }, 1000);    
    },
    
    animateFigure: function($el, value) {
        var $top = $el.find('.top'),
            $bottom = $el.find('.bottom'),
            $back_top = $el.find('.top-back'),
            $back_bottom = $el.find('.bottom-back');
        
        // Before we begin, change the back value
        $back_top.find('span').html(value);
        $back_bottom.find('span').html(value);
        
        // Then animate
        TweenMax.to($top, 0.8, {
            rotationX: '-180deg',
            transformPerspective: 300,
            ease: Quart.easeOut,
            onComplete: function() {
                $top.html(value);
                $bottom.html(value);
                TweenMax.set($top, { rotationX: 0 });
            }
        });
        
        TweenMax.to($back_top, 0.8, { 
            rotationX: 0,
            transformPerspective: 300,
            ease: Quart.easeOut, 
            clearProps: 'all' 
        });    
    },
    
    checkHour: function(value, $el_1, $el_2) {
        var val_1 = value.toString().charAt(0),
            val_2 = value.toString().charAt(1),
            fig_1_value = $el_1.find('.top').html(),
            fig_2_value = $el_2.find('.top').html();
        
        if (value >= 10) {
            if (fig_1_value !== val_1) this.animateFigure($el_1, val_1);
            if (fig_2_value !== val_2) this.animateFigure($el_2, val_2);
        } else {
            if (fig_1_value !== '0') this.animateFigure($el_1, 0);
            if (fig_2_value !== val_1) this.animateFigure($el_2, val_1);
        }    
    },
    
    checkThreeDigits: function(value, $el_1, $el_2, $el_3) {
        var val_1 = value.toString().padStart(3, "0").charAt(0),
            val_2 = value.toString().padStart(3, "0").charAt(1),
            val_3 = value.toString().padStart(3, "0").charAt(2),
            fig_1_value = $el_1.find(".top").html(),
            fig_2_value = $el_2.find(".top").html(),
            fig_3_value = $el_3.find(".top").html();
    
        if (fig_1_value !== val_1) this.animateFigure($el_1, val_1);
        if (fig_2_value !== val_2) this.animateFigure($el_2, val_2);
        if (fig_3_value !== val_3) this.animateFigure($el_3, val_3);
    },
};

// Let's go!
Countdown.init();
