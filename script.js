document.addEventListener('DOMContentLoaded', function() {
    // 获取页面元素
    const inputPage = document.getElementById('input-page');
    const resultPage = document.getElementById('result-page');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    const monthlySalaryInput = document.getElementById('monthly-salary');
    const workDaysInput = document.getElementById('work-days');
    const hoursPerDayInput = document.getElementById('hours-per-day');
    
    const earnedAmountElement = document.getElementById('earned-amount');
    const workedTimeElement = document.getElementById('worked-time');
    const hourlyRateElement = document.getElementById('hourly-rate');
    const minuteRateElement = document.getElementById('minute-rate');
    const secondRateElement = document.getElementById('second-rate');
    
    // 计算器状态
    let timer = null;
    let startTime = 0;
    let pausedTime = 0;
    let totalPausedTime = 0;
    let isPaused = false;
    
    // 收入率
    let hourlyRate = 0;
    let minuteRate = 0;
    let secondRate = 0;
    
    // 格式化时间为 HH:MM:SS
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    }
    
    // 格式化金额
    function formatMoney(amount) {
        return '¥' + amount.toFixed(2);
    }
    
    // 计算收入率
    function calculateRates() {
        const monthlySalary = parseFloat(monthlySalaryInput.value) || 0;
        const workDays = parseInt(workDaysInput.value) || 0;
        const hoursPerDay = parseFloat(hoursPerDayInput.value) || 0;
        
        const totalMonthlyHours = workDays * hoursPerDay;
        
        if (totalMonthlyHours === 0) {
            return {
                hourly: 0,
                minute: 0,
                second: 0
            };
        }
        
        const hourlyRate = monthlySalary / totalMonthlyHours;
        const minuteRate = hourlyRate / 60;
        const secondRate = minuteRate / 60;
        
        return {
            hourly: hourlyRate,
            minute: minuteRate,
            second: secondRate
        };
    }
    
    // 更新收入显示
    function updateIncomeDisplay() {
        if (!startTime || isPaused) return;
        
        const now = Date.now();
        const elapsedMilliseconds = now - startTime - totalPausedTime;
        const elapsedSeconds = elapsedMilliseconds / 1000;
        
        // 更新已工作时间
        workedTimeElement.textContent = formatTime(elapsedSeconds);
        
        // 计算并更新已赚金额
        const earnedAmount = secondRate * elapsedSeconds;
        earnedAmountElement.textContent = formatMoney(earnedAmount);
    }
    
    // 开始计算
    startBtn.addEventListener('click', function() {
        // 计算收入率
        const rates = calculateRates();
        hourlyRate = rates.hourly;
        minuteRate = rates.minute;
        secondRate = rates.second;
        
        // 显示收入率
        hourlyRateElement.textContent = formatMoney(hourlyRate);
        minuteRateElement.textContent = formatMoney(minuteRate);
        secondRateElement.textContent = formatMoney(secondRate);
        
        // 切换到结果页面
        inputPage.classList.remove('active');
        resultPage.classList.add('active');
        
        // 开始计时
        startTime = Date.now();
        isPaused = false;
        totalPausedTime = 0;
        
        // 设置定时器每秒更新一次显示
        timer = setInterval(updateIncomeDisplay, 100);
    });
    
    // 暂停/继续计算
    pauseBtn.addEventListener('click', function() {
        if (isPaused) {
            // 继续
            isPaused = false;
            totalPausedTime += (Date.now() - pausedTime);
            pauseBtn.textContent = '暂停';
            timer = setInterval(updateIncomeDisplay, 100);
        } else {
            // 暂停
            isPaused = true;
            pausedTime = Date.now();
            pauseBtn.textContent = '继续';
            clearInterval(timer);
        }
    });
    
    // 重置计算
    resetBtn.addEventListener('click', function() {
        // 回到输入页面
        resultPage.classList.remove('active');
        inputPage.classList.add('active');
        
        // 重置状态
        clearInterval(timer);
        startTime = 0;
        isPaused = false;
        pauseBtn.textContent = '暂停';
        earnedAmountElement.textContent = '¥0.00';
        workedTimeElement.textContent = '00:00:00';
    });
}); 