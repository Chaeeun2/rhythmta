let bgList = ['black', 'white'];
let currentBg = true;
let changeMusic = document.querySelector('.change-music');

class BPMCalculator {
    constructor() {
        this.tapTimes = [];
        this.maxTaps = 8;
        this.tabCount = document.querySelector('.tabCount');
        this.bpmTextInterval = null;
        this.currentTextIndex = 0;
        
        // 카운트다운 요소 미리 생성
        this.countdownElement = document.createElement('div');
        this.countdownElement.style.position = 'fixed';
        this.countdownElement.style.top = '50%';
        this.countdownElement.style.left = '50%';
        this.countdownElement.style.transform = 'translate(-50%, -50%)';
        this.countdownElement.style.fontSize = '10em';
        this.countdownElement.style.fontWeight = 'bold';
        this.countdownElement.style.color = 'white';
        this.countdownElement.style.zIndex = '1000';
        this.countdownElement.style.display = 'none';
        document.body.appendChild(this.countdownElement);
        
        this.initializeAnimation();
        this.initializeEventListeners();
    }
    
    initializeAnimation() {
        const instructions = document.querySelectorAll('.instructions p');
        const instructionWrap = document.querySelector('.instructions');
        let currentIndex = 0;

        const showNextInstruction = () => {
            // 모든 지시사항 숨기기
            instructions.forEach(instruction => {
                instruction.classList.remove('show');
                instruction.classList.remove('animate');
            });

            if (currentIndex < instructions.length) {
                // 현재 지시사항만 보이기
                const currentInstruction = instructions[currentIndex];
                currentInstruction.classList.add('show');

                if (currentBg) {
                    instructionWrap.style.backgroundColor = bgList[0];
                    instructions[currentIndex].style.color = bgList[1];
                    currentBg = false;
                } else {
                    instructionWrap.style.backgroundColor = bgList[1];
                    instructions[currentIndex].style.color = bgList[0];
                    currentBg = true;
                }

                // 애니메이션 시작
                setTimeout(() => {
                    currentInstruction.classList.add('animate');
                }, 50);
                
                currentIndex++;
                setTimeout(showNextInstruction, 1000);
            } else {
                // 모든 지시사항이 표시된 후 지시사항 숨기기
                instructionWrap.style.display = 'none';
                this.tabCount.style.display = 'block';
            }
        };

        // 애니메이션 시작
        setTimeout(showNextInstruction, 50);
    }
    
    initializeEventListeners() {
        document.body.addEventListener('click', () => this.handleTap());
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleTap();
            }
        });

        // change-music 클릭 이벤트 추가
        const changeMusic = document.querySelector('.change-music');
        if (changeMusic) {
            changeMusic.addEventListener('click', () => this.reset());
        }
    }
    
    handleTap() {
        if (this.tapTimes.length >= this.maxTaps) {
            return;
        }

        if (currentBg) {
            document.body.style.backgroundColor = bgList[0];
            this.tabCount.style.color = bgList[1];
            currentBg = false;
        } else {
            document.body.style.backgroundColor = bgList[1];
            this.tabCount.style.color = bgList[0];
            currentBg = true;
        }
        const now = Date.now();
        this.tapTimes.push(now);
        
        // 탭 카운트 업데이트
        if (this.tabCount) {
            this.tabCount.textContent = `${this.tapTimes.length}/${this.maxTaps}`;
        }
        
        if (this.tapTimes.length === this.maxTaps) {
            // BPM 미리 계산
            const bpm = this.calculateBPM();
            
            // 카운트다운 시작
            this.tabCount.style.display = 'none';
            
            // 약간의 지연 후 다른 작업 실행
            setTimeout(() => {
                this.startCountdown(bpm);
                document.body.style.backgroundColor = "black";
            }, (60 / bpm) * 1000 - 100);
        }
    }
    
    calculateBPM() {
        const intervals = [];
        for (let i = 1; i < this.tapTimes.length; i++) {
            intervals.push(this.tapTimes[i] - this.tapTimes[i - 1]);
        }
        
        const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;
        const bpm = Math.round(60000 / averageInterval);
        return bpm;
    }

    startBPMTextAnimation() {
        const bpm = this.calculateBPM();
        let bpmTexts;
        let bgList2;
        let interval;

        // BPM 범위에 따라 적절한 텍스트 요소 선택
        if (bpm < 80) {
            bpmTexts = document.querySelectorAll('.bpm80 p');
            bgList2 = ['green', 'black'];
            interval = (60 / bpm) * 2000;
        } else if (bpm < 100) {
            bpmTexts = document.querySelectorAll('.bpm100 p');
            bgList2 = ['yellow', 'black'];
            interval = (60 / bpm) * 1000;
        } else if (bpm < 120) {
            bpmTexts = document.querySelectorAll('.bpm120 p');
            bgList2 = ['purple', 'white'];
            interval = (60 / bpm) * 1000;
        } else if (bpm < 140) {
            bpmTexts = document.querySelectorAll('.bpm140 p');
            bgList2 = ['blue', 'white'];
            interval = (60 / bpm) * 1000;
        } else {
            bpmTexts = document.querySelectorAll('.bpm160 p');
            bgList2 = ['red', 'black'];
            interval = (60 / bpm) * 500;
        }

        // 기존 인터벌 제거
        if (this.bpmTextInterval) {
            clearInterval(this.bpmTextInterval);
        }

        // 모든 텍스트 숨기기
        bpmTexts.forEach(text => {
            text.classList.remove('show');
        });

        this.currentTextIndex = 0;

        // BPM에 맞춰 텍스트 표시
        this.bpmTextInterval = setInterval(() => {
            // 모든 텍스트 숨기기
            bpmTexts.forEach(text => {
                text.classList.remove('show');
            });

            // 현재 텍스트 표시
            const currentText = bpmTexts[this.currentTextIndex];
            if (currentText) {
                currentText.classList.add('show');
                currentText.style.animation = `textChange ${interval}ms ease forwards`;
            }

            if (currentBg) {
                document.body.style.backgroundColor = bgList2[0];
                bpmTexts[this.currentTextIndex].style.color = bgList2[1];
                changeMusic.style.color = bgList2[1];
                currentBg = false;
            } else {
                document.body.style.backgroundColor = bgList2[1];
                bpmTexts[this.currentTextIndex].style.color = bgList2[0];
                 changeMusic.style.color = bgList2[0];
                currentBg = true;
            }

            // 다음 텍스트 인덱스 계산
            this.currentTextIndex = (this.currentTextIndex + 1) % bpmTexts.length;
        }, interval);
    }

    startCountdown(bpm) {
        const interval = (60 / bpm) * 1000;
        let count = 3;
        
        // 카운트다운 요소 표시 및 초기값 설정
        this.countdownElement.style.display = 'block';
        this.countdownElement.textContent = count;
        
        const countdownInterval = setInterval(() => {
            count--;
            if (count >= 0) {
                this.countdownElement.textContent = count;
            } else {
                clearInterval(countdownInterval);
                this.countdownElement.style.display = 'none';
                // 카운트다운이 끝나면 BPM 텍스트 애니메이션 시작
                setTimeout(() => {
                    this.startBPMTextAnimation();
                    changeMusic.style.display = 'block';
                }, 0);
            }
        }, interval);
    }

    reset() {
        // 모든 상태 초기화
        this.tapTimes = [];
        this.currentTextIndex = 0;
        currentBg = true;
        
        // 인터벌 제거
        if (this.bpmTextInterval) {
            clearInterval(this.bpmTextInterval);
            this.bpmTextInterval = null;
        }
        
        // UI 초기화
        document.body.style.backgroundColor = "white";
        this.countdownElement.style.display = 'none';
        
        // 탭 카운트 초기화
        if (this.tabCount) {
            this.tabCount.textContent = "0/8";
        }
        
        // 모든 BPM 텍스트 숨기기
        const allBpmTexts = document.querySelectorAll('.bpm80 p, .bpm100 p, .bpm120 p, .bpm140 p, .bpm160 p');
        allBpmTexts.forEach(text => {
            text.classList.remove('show');
        });
        changeMusic.style.display = 'none';
        this.tabCount.style.display = 'block';
    }
}

// DOM이 완전히 로드된 후에 BPM 계산기 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    const bpmCalculator = new BPMCalculator();
}); 